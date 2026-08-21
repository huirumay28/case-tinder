// Case Tinder - Google Apps Script Backend
// This script handles the API for Case Tinder
// Deploy as a web app and set to "Anyone" access

// Configuration
const INVITE_CODE = 'ALIEN';

// Sheet names
const ROSTER_SHEET = 'Roster';
const SWIPES_SHEET = 'Swipes';
const STATE_SHEET = 'State';
const COMMENTS_SHEET = 'Comments';

// Main entry point for GET requests
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  let result;
  
  try {
    switch (action) {
      case 'roster':
        result = getRoster();
        break;
      case 'login':
        result = handleLogin(e.parameter.code, e.parameter.name);
        break;
      case 'state':
        result = getUserState(e.parameter.name);
        break;
      case 'swipe':
        result = recordSwipe(e.parameter.name, e.parameter.caseId, e.parameter.liked, e.parameter.date);
        break;
      case 'scoreboard':
        result = getScoreboard();
        break;
      case 'comments':
        result = getComments(e.parameter.caseId);
        break;
      case 'comment':
        result = postComment(e.parameter.name, e.parameter.caseId, e.parameter.text);
        break;
      default:
        result = { ok: false, error: 'unknown_action' };
    }
  } catch (error) {
    result = { ok: false, error: error.toString() };
  }
  
  // JSONP response
  const output = callback + '(' + JSON.stringify(result) + ')';
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// Get roster of all team members
function getRoster() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ROSTER_SHEET);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(ROSTER_SHEET);
    sheet.appendRow(['Name', 'Color']);
    
    // Initialize with the 13 team members
    const defaultRoster = [
      ['Hao Tseng', '#FF6B35'],
      ['Huiru', '#FF4458'],
      ['Albert Hsu', '#3498DB'],
      ['Eric Lin', '#9B59B6'],
      ['Eric Chen', '#2ECC71'],
      ['Brian Chen', '#F39C12'],
      ['Ona Chen', '#E91E63'],
      ['Ping Tseng', '#1ABC9C'],
      ['Vivi Tsou', '#E74C3C'],
      ['Dane Chang', '#34495E'],
      ['Jessie Hong', '#8E44AD'],
      ['Clio Wang', '#16A085'],
      ['Hugh Huang', '#D35400']
    ];
    
    defaultRoster.forEach(row => sheet.appendRow(row));
  }
  
  const data = sheet.getDataRange().getValues();
  const members = data.slice(1).map(row => ({
    name: row[0],
    color: row[1]
  }));
  
  return { ok: true, members: members };
}

// Handle login
function handleLogin(code, name) {
  if (code !== INVITE_CODE) {
    return { ok: false, error: 'bad_code' };
  }
  
  const roster = getRoster();
  const member = roster.members.find(m => m.name === name);
  
  if (!member) {
    return { ok: false, error: 'unknown_name' };
  }
  
  const state = getUserState(name);
  
  return {
    ok: true,
    name: member.name,
    color: member.color,
    likes: state.likes,
    viewCount: state.viewCount,
    viewedDays: state.viewedDays,
    todayCaseIds: state.todayCaseIds
  };
}

// Get user state
function getUserState(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let stateSheet = ss.getSheetByName(STATE_SHEET);
  
  if (!stateSheet) {
    stateSheet = ss.insertSheet(STATE_SHEET);
    stateSheet.appendRow(['Name', 'ViewCount', 'Likes', 'ViewedDays']);
    // Force ViewedDays column to text format
    stateSheet.getRange('D:D').setNumberFormat('@');
  }
  
  const stateData = stateSheet.getDataRange().getValues();
  const userRow = stateData.find(row => row[0] === name);
  
  let viewCount = 0;
  let likes = [];
  let viewedDays = [];
  
  if (userRow) {
    viewCount = userRow[1] || 0;
    likes = userRow[2] ? String(userRow[2]).split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : [];
    
    // Normalize ViewedDays - handle Sheets date mangling
    if (userRow[3]) {
      const rawDays = String(userRow[3]).split(',');
      viewedDays = rawDays.map(day => normalizeDay(day.trim())).filter(d => d);
    }
  }
  
  // Get today's swiped case IDs
  const todayCaseIds = getTodaySwipedCases(name);
  
  return {
    ok: true,
    name: name,
    viewCount: viewCount,
    likes: likes,
    viewedDays: viewedDays,
    todayCaseIds: todayCaseIds
  };
}

// Normalize a day value to YYYY-MM-DD
// Handles Date objects and various string formats from Sheets
function normalizeDay(value) {
  if (!value) return null;
  
  // If it's a Date object, format it
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, 'Asia/Taipei', 'yyyy-MM-dd');
  }
  
  const str = String(value).trim();
  
  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  
  // Try parsing as a date
  try {
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return Utilities.formatDate(parsed, 'Asia/Taipei', 'yyyy-MM-dd');
    }
  } catch (e) {
    // Invalid date, skip
  }
  
  return null;
}

// Get today's swiped cases for a user
function getTodaySwipedCases(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let swipesSheet = ss.getSheetByName(SWIPES_SHEET);
  
  if (!swipesSheet) {
    return [];
  }
  
  const today = getTaipeiDateString();
  const data = swipesSheet.getDataRange().getValues();
  
  const todayCases = data.slice(1)
    .filter(row => {
      const rowDate = normalizeDay(row[3]);
      return row[0] === name && rowDate === today;
    })
    .map(row => parseInt(row[1]));
  
  return todayCases;
}

// Record a swipe
function recordSwipe(name, caseId, liked, date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let swipesSheet = ss.getSheetByName(SWIPES_SHEET);
  
  if (!swipesSheet) {
    swipesSheet = ss.insertSheet(SWIPES_SHEET);
    swipesSheet.appendRow(['Name', 'CaseId', 'Liked', 'Date', 'Timestamp']);
    // Force Date column to text format to prevent Sheets conversion
    swipesSheet.getRange('D:D').setNumberFormat('@');
  }
  
  // Record the swipe
  const timestamp = new Date().toISOString();
  swipesSheet.appendRow([name, parseInt(caseId), liked === '1' ? 1 : 0, date, timestamp]);
  
  // Force text format on the new row's Date cell
  const newRowIndex = swipesSheet.getLastRow();
  swipesSheet.getRange(newRowIndex, 4).setNumberFormat('@');
  
  // Update state
  updateUserState(name, parseInt(caseId), liked === '1', date);
  
  return { ok: true };
}

// Update user state after a swipe
function updateUserState(name, caseId, liked, date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let stateSheet = ss.getSheetByName(STATE_SHEET);
  
  if (!stateSheet) {
    stateSheet = ss.insertSheet(STATE_SHEET);
    stateSheet.appendRow(['Name', 'ViewCount', 'Likes', 'ViewedDays']);
    // Force ViewedDays column to text format
    stateSheet.getRange('D:D').setNumberFormat('@');
  }
  
  const data = stateSheet.getDataRange().getValues();
  let rowIndex = -1;
  let userRow = null;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === name) {
      rowIndex = i + 1;
      userRow = data[i];
      break;
    }
  }
  
  let viewCount = 1;
  let likes = [];
  let viewedDays = [date];
  
  if (userRow) {
    viewCount = (userRow[1] || 0) + 1;
    likes = userRow[2] ? String(userRow[2]).split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : [];
    
    // Normalize existing viewedDays
    if (userRow[3]) {
      const rawDays = String(userRow[3]).split(',');
      viewedDays = rawDays.map(day => normalizeDay(day.trim())).filter(d => d);
    } else {
      viewedDays = [];
    }
    
    if (liked && !likes.includes(caseId)) {
      likes.push(caseId);
    }
    
    if (!viewedDays.includes(date)) {
      viewedDays.push(date);
    }
    
    stateSheet.getRange(rowIndex, 2).setValue(viewCount);
    stateSheet.getRange(rowIndex, 3).setValue(likes.join(','));
    
    // Force text format for ViewedDays to prevent Sheets date conversion
    const viewedDaysCell = stateSheet.getRange(rowIndex, 4);
    viewedDaysCell.setNumberFormat('@');
    viewedDaysCell.setValue(viewedDays.join(','));
  } else {
    if (liked) {
      likes = [caseId];
    }
    
    // Append new row
    stateSheet.appendRow([name, viewCount, likes.join(','), date]);
    
    // Force text format on the new row's ViewedDays cell
    const newRowIndex = stateSheet.getLastRow();
    stateSheet.getRange(newRowIndex, 4).setNumberFormat('@');
  }
}

// Get scoreboard data
function getScoreboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stateSheet = ss.getSheetByName(STATE_SHEET);
  
  if (!stateSheet) {
    // Return roster with zero counts
    const roster = getRoster();
    const members = roster.members.map(m => ({
      name: m.name,
      color: m.color,
      viewCount: 0,
      likes: []
    }));
    return { ok: true, members: members };
  }
  
  const roster = getRoster();
  const stateData = stateSheet.getDataRange().getValues();
  
  const members = roster.members.map(member => {
    const userRow = stateData.find(row => row[0] === member.name);
    
    let viewCount = 0;
    let likes = [];
    
    if (userRow) {
      viewCount = userRow[1] || 0;
      likes = userRow[2] ? String(userRow[2]).split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : [];
    }
    
    return {
      name: member.name,
      color: member.color,
      viewCount: viewCount,
      likes: likes
    };
  });
  
  return { ok: true, members: members };
}

// Get date string in Asia/Taipei timezone (YYYY-MM-DD)
function getTaipeiDateString() {
  const now = new Date();
  const taipeiTime = Utilities.formatDate(now, 'Asia/Taipei', 'yyyy-MM-dd');
  return taipeiTime;
}

// Get comments for a case (or counts for all cases)
function getComments(caseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let commentsSheet = ss.getSheetByName(COMMENTS_SHEET);
  
  if (!commentsSheet) {
    commentsSheet = ss.insertSheet(COMMENTS_SHEET);
    commentsSheet.appendRow(['Name', 'CaseId', 'Text', 'Timestamp']);
    // Force columns to text format
    commentsSheet.getRange('A:A').setNumberFormat('@');
    commentsSheet.getRange('C:C').setNumberFormat('@');
    commentsSheet.getRange('D:D').setNumberFormat('@');
  }
  
  const data = commentsSheet.getDataRange().getValues();
  
  // If caseId is provided, return comments for that case
  if (caseId) {
    const caseComments = data.slice(1)
      .filter(row => String(row[1]) === String(caseId))
      .map(row => ({
        name: row[0],
        caseId: parseInt(row[1]),
        text: row[2],
        timestamp: row[3]
      }));
    
    return { ok: true, comments: caseComments };
  }
  
  // Otherwise, return counts per case
  const counts = {};
  data.slice(1).forEach(row => {
    const id = String(row[1]);
    counts[id] = (counts[id] || 0) + 1;
  });
  
  return { ok: true, counts: counts };
}

// Post a new comment
function postComment(name, caseId, text) {
  // Validate inputs
  if (!name || !caseId || !text) {
    return { ok: false, error: 'missing_params' };
  }
  
  // Trim and validate text
  const trimmedText = String(text).trim();
  if (trimmedText.length === 0) {
    return { ok: false, error: 'empty_text' };
  }
  
  if (trimmedText.length > 200) {
    return { ok: false, error: 'text_too_long' };
  }
  
  // Verify name is in roster
  const roster = getRoster();
  const member = roster.members.find(m => m.name === name);
  if (!member) {
    return { ok: false, error: 'unknown_name' };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let commentsSheet = ss.getSheetByName(COMMENTS_SHEET);
  
  if (!commentsSheet) {
    commentsSheet = ss.insertSheet(COMMENTS_SHEET);
    commentsSheet.appendRow(['Name', 'CaseId', 'Text', 'Timestamp']);
    // Force columns to text format
    commentsSheet.getRange('A:A').setNumberFormat('@');
    commentsSheet.getRange('C:C').setNumberFormat('@');
    commentsSheet.getRange('D:D').setNumberFormat('@');
  }
  
  // Append comment
  const timestamp = new Date().toISOString();
  commentsSheet.appendRow([name, parseInt(caseId), trimmedText, timestamp]);
  
  // Force text format on the new row
  const newRowIndex = commentsSheet.getLastRow();
  commentsSheet.getRange(newRowIndex, 1).setNumberFormat('@');
  commentsSheet.getRange(newRowIndex, 3).setNumberFormat('@');
  commentsSheet.getRange(newRowIndex, 4).setNumberFormat('@');
  
  return { 
    ok: true, 
    comment: {
      name: name,
      caseId: parseInt(caseId),
      text: trimmedText,
      timestamp: timestamp
    }
  };
}
