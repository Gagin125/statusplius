const ADMIN_SHEET_NAME = 'Administracija';
const ANNOUNCEMENTS_SHEET_NAME = 'Pranešimai';

const ANNOUNCEMENT_HEADERS = [
  'id',
  'type',
  'title',
  'description',
  'date',
  'class',
  'teacher',
  'subject',
  'createdBy',
  'createdAt',
];

const USER_SCHEMAS = {
  mokinys: {
    sheetName: 'Mokiniai',
    headers: ['email', 'password', 'vardas', 'pavardė', 'klasė', 'createdAt'],
    fieldOrder: ['vardas', 'pavarde', 'klase'],
  },
  tevai: {
    sheetName: 'Tėvai',
    headers: [
      'email',
      'password',
      'vardas',
      'pavardė',
      'Vaiko / globotinio vardas',
      'Vaiko / globotinio pavardė',
      'Vaiko / globotinio klasė',
      'createdAt',
    ],
    fieldOrder: ['vardas', 'pavarde', 'vaikoVardas', 'vaikoPavarde', 'vaikoKlase'],
  },
  mokytojas: {
    sheetName: 'Mokytojai',
    headers: ['email', 'password', 'vardas', 'pavardė', 'Dalyko mokytojas', 'createdAt'],
    fieldOrder: ['vardas', 'pavarde', 'dalykoMokytojas'],
  },
};

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';
  if (action === 'listAnnouncements') {
    return jsonOk_(listAnnouncements_());
  }

  return jsonError_('Neteisingas veiksmas.');
}

function doPost(e) {
  const payload = parseBody_(e);
  if (!payload) {
    return jsonError_('Blogas JSON.');
  }

  switch (payload.action) {
    case 'createUser': {
      const createdUser = createUser_(payload);
      if (createdUser.error) {
        return jsonError_(createdUser.error);
      }
      return jsonOk_();
    }
    case 'loginUser': {
      const loginResult = loginUser_(payload);
      if (loginResult.error) {
        return jsonError_(loginResult.error);
      }
      return jsonOk_();
    }
    case 'createAnnouncement': {
      const created = createAnnouncement_(payload);
      if (created.error) {
        return jsonError_(created.error);
      }
      return jsonOk_(created);
    }
    case 'updateAnnouncement': {
      const updated = updateAnnouncement_(payload);
      if (updated.error) {
        return jsonError_(updated.error);
      }
      return jsonOk_(updated);
    }
    case 'deleteAnnouncement': {
      const removed = deleteAnnouncement_(payload);
      if (removed.error) {
        return jsonError_(removed.error);
      }
      return jsonOk_({ id: payload.id });
    }
    default:
      return handleAdminLogin_(payload);
  }
}

function loginUser_(payload) {
  const role = normalizeRole_(payload.role);
  const email = normalizeEmail_(payload.email);
  const password = String(payload.password || '').trim();

  if (!role || !email || !password) {
    return { error: 'Trūksta prisijungimo duomenų.' };
  }

  const sheet = getUserSheet_(role);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return { error: 'Paskyra nerasta. Pirma užsiregistruokite.' };
  }

  for (let i = 1; i < data.length; i += 1) {
    const rowEmail = normalizeEmail_(data[i][0]);
    const rowPassword = String(data[i][1] || '').trim();
    if (rowEmail === email && rowPassword === password) {
      return { ok: true };
    }
  }

  return { error: 'Neteisingi prisijungimo duomenys.' };
}

function createUser_(payload) {
  const role = normalizeRole_(payload.role);
  const email = normalizeEmail_(payload.email);
  const password = String(payload.password || '').trim();

  if (!role || !email || !password) {
    return { error: 'Trūksta registracijos duomenų.' };
  }

  const profile = normalizeUserProfile_(payload);
  const validationError = validateUserProfile_(role, profile);
  if (validationError) {
    return { error: validationError };
  }

  const sheet = getUserSheet_(role);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i += 1) {
    const rowEmail = normalizeEmail_(data[i][0]);
    if (rowEmail === email) {
      return { error: 'Šis el. paštas jau užregistruotas.' };
    }
  }

  const schema = getUserSchema_(role);
  const row = [
    email,
    password,
    ...schema.fieldOrder.map((fieldKey) => profile[fieldKey] || ''),
    new Date().toISOString(),
  ];

  sheet.appendRow(row);
  return { ok: true };
}

function normalizeUserProfile_(payload) {
  return {
    vardas: String(payload.vardas || '').trim(),
    pavarde: String(payload.pavarde || '').trim(),
    klase: String(payload.klase || '').trim(),
    vaikoVardas: String(payload.vaikoVardas || '').trim(),
    vaikoPavarde: String(payload.vaikoPavarde || '').trim(),
    vaikoKlase: String(payload.vaikoKlase || '').trim(),
    dalykoMokytojas: String(payload.dalykoMokytojas || '').trim(),
  };
}

function validateUserProfile_(role, profile) {
  if (role === 'mokinys') {
    if (!profile.vardas || !profile.pavarde || !profile.klase) {
      return 'Užpildykite vardą, pavardę ir klasę.';
    }
    return '';
  }

  if (role === 'tevai') {
    if (!profile.vardas || !profile.pavarde || !profile.vaikoVardas || !profile.vaikoPavarde || !profile.vaikoKlase) {
      return 'Užpildykite visus tėvų ir vaiko/globotinio laukus.';
    }
    return '';
  }

  if (role === 'mokytojas') {
    if (!profile.vardas || !profile.pavarde || !profile.dalykoMokytojas) {
      return 'Užpildykite vardą, pavardę ir dalyką.';
    }
    return '';
  }

  return 'Neteisingas vaidmuo.';
}

function handleAdminLogin_(payload) {
  const email = normalizeEmail_(payload.email);
  const password = String(payload.password || '').trim();
  if (!email || !password) {
    return jsonError_('Trūksta prisijungimo duomenų.');
  }

  const sheet = getOrCreateSheet_(ADMIN_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return jsonError_('Administracijos paskyros nerastos.');
  }

  for (let i = 1; i < data.length; i += 1) {
    const rowEmail = normalizeEmail_(data[i][0]);
    const rowPassword = String(data[i][1] || '').trim();
    if (rowEmail === email && rowPassword === password) {
      return jsonOk_();
    }
  }

  return jsonError_('Neteisingi administratoriaus prisijungimo duomenys.');
}

function listAnnouncements_() {
  const sheet = getAnnouncementsSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, ANNOUNCEMENT_HEADERS.length).getValues();
  const items = values
    .map((row) => rowToObject_(row))
    .filter((item) => item.id || item.title);

  items.sort((a, b) => {
    const aTime = new Date(a.createdAt || a.date || 0).getTime();
    const bTime = new Date(b.createdAt || b.date || 0).getTime();
    return bTime - aTime;
  });

  return items;
}

function createAnnouncement_(payload) {
  const sheet = getAnnouncementsSheet_();
  const normalized = normalizeAnnouncement_(payload);

  if (!normalized.title || !normalized.description || !normalized.date) {
    return { error: 'Trūksta pranešimo duomenų.' };
  }

  const id = Utilities.getUuid();
  const createdAt = new Date().toISOString();
  const record = Object.assign({}, normalized, {
    id: id,
    createdAt: createdAt,
  });

  sheet.appendRow(ANNOUNCEMENT_HEADERS.map((key) => record[key] || ''));
  return record;
}

function updateAnnouncement_(payload) {
  const id = String(payload.id || '').trim();
  if (!id) {
    return { error: 'Trūksta pranešimo ID.' };
  }

  const sheet = getAnnouncementsSheet_();
  const found = findAnnouncementRow_(sheet, id);
  if (!found) {
    return { error: 'Pranešimas nerastas.' };
  }

  const normalized = normalizeAnnouncement_(payload);
  const updated = Object.assign({}, found.data, normalized, {
    id: found.data.id,
    createdAt: found.data.createdAt || new Date().toISOString(),
  });

  sheet
    .getRange(found.rowIndex, 1, 1, ANNOUNCEMENT_HEADERS.length)
    .setValues([ANNOUNCEMENT_HEADERS.map((key) => updated[key] || '')]);

  return updated;
}

function deleteAnnouncement_(payload) {
  const id = String(payload.id || '').trim();
  if (!id) {
    return { error: 'Trūksta pranešimo ID.' };
  }

  const sheet = getAnnouncementsSheet_();
  const found = findAnnouncementRow_(sheet, id);
  if (!found) {
    return { error: 'Pranešimas nerastas.' };
  }

  sheet.deleteRow(found.rowIndex);
  return { id: id };
}

function getAnnouncementsSheet_() {
  const sheet = getOrCreateSheet_(ANNOUNCEMENTS_SHEET_NAME);
  const header = sheet.getRange(1, 1, 1, ANNOUNCEMENT_HEADERS.length).getValues()[0];
  const normalizedHeader = header.map((value) => String(value || '').trim());
  if (normalizedHeader.join('|') !== ANNOUNCEMENT_HEADERS.join('|')) {
    sheet.getRange(1, 1, 1, ANNOUNCEMENT_HEADERS.length).setValues([ANNOUNCEMENT_HEADERS]);
  }
  return sheet;
}

function findAnnouncementRow_(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  const values = sheet.getRange(2, 1, lastRow - 1, ANNOUNCEMENT_HEADERS.length).getValues();
  for (let i = 0; i < values.length; i += 1) {
    const rowId = String(values[i][0] || '').trim();
    if (rowId === id) {
      return {
        rowIndex: i + 2,
        data: rowToObject_(values[i]),
      };
    }
  }

  return null;
}

function rowToObject_(row) {
  const record = {};
  ANNOUNCEMENT_HEADERS.forEach((key, index) => {
    record[key] = row[index] !== undefined ? String(row[index] || '').trim() : '';
  });
  return record;
}

function normalizeAnnouncement_(payload) {
  const allowedTypes = ['cancelled-lesson', 'absent-teacher', 'class-announcement', 'urgent'];
  const rawType = String(payload.type || '').trim();
  const type = allowedTypes.indexOf(rawType) >= 0 ? rawType : 'class-announcement';

  return {
    id: String(payload.id || '').trim(),
    type: type,
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    date: String(payload.date || '').trim(),
    class: String(payload.class || '').trim(),
    teacher: String(payload.teacher || '').trim(),
    subject: String(payload.subject || '').trim(),
    createdBy: String(payload.createdBy || 'admin').trim(),
    createdAt: String(payload.createdAt || '').trim(),
  };
}

function parseBody_(e) {
  try {
    return JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');
  } catch (error) {
    return null;
  }
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeRole_(value) {
  const role = String(value || '').trim();
  return getUserSchema_(role) ? role : '';
}

function getUserSchema_(role) {
  return USER_SCHEMAS[role] || null;
}

function getOrCreateSheet_(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Nepavyko rasti aktyvios skaičiuoklės. Atidarykite Apps Script iš Google Sheets.');
  }

  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  return sheet;
}

function getUserSheet_(role) {
  const schema = getUserSchema_(role);
  if (!schema) {
    throw new Error('Neteisingas vaidmuo.');
  }

  const sheet = getOrCreateSheet_(schema.sheetName);
  const header = sheet.getRange(1, 1, 1, schema.headers.length).getValues()[0];
  const normalizedHeader = header.map((value) => String(value || '').trim());
  if (normalizedHeader.join('|') !== schema.headers.join('|')) {
    sheet.getRange(1, 1, 1, schema.headers.length).setValues([schema.headers]);
  }
  return sheet;
}

function jsonOk_(data) {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      data: data,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function jsonError_(message) {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: false,
      message: message,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
