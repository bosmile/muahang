/* ============ ADD ROW ============ */
function addRow() {
  const tbody = document.getElementById("itemsBody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input class="name" placeholder="Tên hàng"></td>
    <td><input type="number" class="qty" value="1" min="1"></td>
    <td><input type="number" class="price" value="0" min="0"></td>
    <td class="total">0</td>
    <td><button type="button" onclick="removeRow(this)">❌</button></td>
  `;

  tbody.appendChild(tr);
  tr.querySelector(".qty").oninput = calcTotal;
  tr.querySelector(".price").oninput = calcTotal;
  calcTotal();
}

function removeRow(btn) {
  btn.closest("tr").remove();
  calcTotal();
}

/* ============ CALC TOTAL ============ */
function calcTotal() {
  let sum = 0;
  document.querySelectorAll("#itemsBody tr").forEach(tr => {
    const qty = +tr.querySelector(".qty").value || 0;
    const price = +tr.querySelector(".price").value || 0;
    const total = qty * price;
    tr.querySelector(".total").innerText = total.toLocaleString();
    sum += total;
  });
  document.getElementById("grandTotal").innerText = sum.toLocaleString();
}

/* ============ SAVE ============ */
async function saveInvoice() {
  if (!confirm("Bạn có chắc muốn lưu hóa đơn không?")) return;

  const rows = document.querySelectorAll("#itemsBody tr");
  if (!rows.length) return alert("Chưa có hàng hóa");

  const items = [];
  rows.forEach(tr => {
    items.push({
      name: tr.querySelector(".name").value,
      quantity: tr.querySelector(".qty").value,
      price: tr.querySelector(".price").value,
      total:
        tr.querySelector(".qty").value *
        tr.querySelector(".price").value
    });
  });

  const payload = {
    invoice_id: "HD_" + Date.now(),
    date: document.getElementById("date").value,
    category: document.getElementById("category").value,
    note: document.getElementById("note").value,
    grand_total: items.reduce((s, i) => s + i.total, 0),
    items
  };

  const form = new URLSearchParams();
  form.append("data", JSON.stringify(payload));

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: form
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    alert("✅ Đã lưu hóa đơn!");
    resetForm();

  } catch (err) {
    alert("❌ Lỗi lưu:\n" + err.message);
  }
}

/* ============ RESET ============ */
function resetForm() {
  document.getElementById("date").value = "";
  document.getElementById("note").value = "";
  document.getElementById("category").value = "BIGC";
  document.getElementById("itemsBody").innerHTML = "";
  document.getElementById("grandTotal").innerText = "0";
  addRow();
}

/* INIT */
addRow();
