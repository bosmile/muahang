let invoices = [];
let items = [];

async function loadData() {
  const res = await fetch(`${API_URL}?action=getInvoices`);
  const data = await res.json();

  invoices = data.invoices;
  items = data.items;

  render();
}

function render() {
  const filter = document.getElementById("categoryFilter").value;
  const list = document.getElementById("invoiceList");
  list.innerHTML = "";

  let total = 0;

  invoices.forEach(inv => {
    if (filter !== "ALL" && inv[2] !== filter) return;

    total += Number(inv[4]);

    const div = document.createElement("div");
    div.className = "invoice-item";
    div.innerHTML = `
      <div class="invoice-left">
        <div class="invoice-title">${inv[2]}</div>
        <div class="invoice-sub">${inv[1]} • ${inv[3]}</div>
      </div>
      <div class="invoice-amount">-${Number(inv[4]).toLocaleString()} đ</div>
    `;
    list.appendChild(div);
  });

  document.getElementById("totalMonth").innerText =
    total.toLocaleString() + " đ";
}

document.getElementById("categoryFilter")
  .addEventListener("change", render);

loadData();
