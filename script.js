const MAX_TABLES = 50;
const tables = {};
const logs = [];

function getThaiTime() {
  return new Date().toLocaleString("th-TH", { hour12: false });
}

function showNotification(msg) {
  const box = document.getElementById("notification");
  box.textContent = msg;
  box.style.display = "block";
  setTimeout(() => box.style.display = "none", 3000);
}

function addTable() {
  const tableNumber = parseInt(document.getElementById("tableNumber").value);
  if (isNaN(tableNumber) || tableNumber < 1) {
    showNotification("กรุณากรอกหมายเลขโต๊ะที่ถูกต้อง");
    return;
  }
  if (tables[tableNumber]) {
    showNotification(`โต๊ะ ${tableNumber} มีลูกค้าอยู่แล้ว`);
    return;
  }
  tables[tableNumber] = { timeIn: getThaiTime() };
  logs.push({ table: tableNumber, action: "เข้าโต๊ะ", time: getThaiTime() });
  updateTables();
}

function removeTable(tableNumber) {
  if (tables[tableNumber]) {
    logs.push({ table: tableNumber, action: "ออกโต๊ะ", time: getThaiTime() });
    delete tables[tableNumber];
    updateTables();
  }
}

function updateTables() {
  const container = document.getElementById("tables");
  container.innerHTML = "";
  Object.keys(tables).forEach(num => {
    const box = document.createElement("div");
    box.className = "table";
    box.innerHTML = `
      <p>โต๊ะ ${num}</p>
      <p>เข้าเมื่อ: ${tables[num].timeIn}</p>
      <button class="remove-btn" onclick="removeTable(${num})">ออก</button>
    `;
    container.appendChild(box);
  });
  document.getElementById("availableTables").textContent = `โต๊ะว่าง: ${MAX_TABLES - Object.keys(tables).length} / ${MAX_TABLES}`;
}

function downloadCSV() {
  const rows = [["หมายเลขโต๊ะ", "การกระทำ", "เวลา"]];
  logs.forEach(log => {
    rows.push([log.table, log.action, log.time]);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "logs.csv";
  a.click();
}
