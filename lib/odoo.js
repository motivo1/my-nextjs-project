const ODOO_URL = process.env.ODOO_URL || "https://dev-erp.asunim.co/odoo";
const ODOO_DB = process.env.ODOO_DB || "";
const ODOO_USERNAME = process.env.ODOO_USERNAME || "";
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "";

let uidCache = null;

async function jsonRpc(url, method, params) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: Date.now(),
      params,
    }),
  });

  if (!res.ok) {
    throw new Error(`Odoo HTTP error: ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || "Odoo RPC error");
  }
  return data.result;
}

async function authenticate() {
  if (uidCache) return uidCache;

  const uid = await jsonRpc(`${ODOO_URL}/web/session/authenticate`, "call", {
    db: ODOO_DB,
    login: ODOO_USERNAME,
    password: ODOO_PASSWORD,
  });

  uidCache = uid;
  return uid;
}

async function searchRead(model, domain = [], fields = [], limit = 50, offset = 0) {
  await authenticate();

  return jsonRpc(`${ODOO_URL}/web/dataset/call_kw`, "call", {
    model,
    method: "search_read",
    args: [domain],
    kwargs: {
      fields,
      limit,
      offset,
      order: "id desc",
    },
  });
}

async function getProducts(limit = 20) {
  return searchRead(
    "product.template",
    [["sale_ok", "=", true]],
    ["name", "list_price", "qty_available", "categ_id", "default_code", "description_sale", "type"],
    limit
  );
}

async function getSaleOrders(limit = 20) {
  return searchRead(
    "sale.order",
    [],
    ["name", "partner_id", "amount_total", "state", "date_order", "order_line"],
    limit
  );
}

async function getContacts(limit = 20) {
  return searchRead(
    "res.partner",
    [["customer_rank", ">", 0]],
    ["name", "email", "phone", "city", "country_id", "customer_rank", "sale_order_count"],
    limit
  );
}

async function getInvoices(limit = 20) {
  return searchRead(
    "account.move",
    [["move_type", "=", "out_invoice"]],
    ["name", "partner_id", "amount_total", "state", "invoice_date", "payment_state"],
    limit
  );
}

async function getInventory(limit = 20) {
  return searchRead(
    "stock.quant",
    [["location_id.usage", "=", "internal"]],
    ["product_id", "quantity", "location_id", "reserved_quantity"],
    limit
  );
}

async function getCrmLeads(limit = 20) {
  return searchRead(
    "crm.lead",
    [],
    ["name", "partner_id", "expected_revenue", "stage_id", "probability", "user_id", "date_deadline"],
    limit
  );
}

function isConfigured() {
  return !!(ODOO_DB && ODOO_USERNAME && ODOO_PASSWORD);
}

export {
  authenticate,
  searchRead,
  getProducts,
  getSaleOrders,
  getContacts,
  getInvoices,
  getInventory,
  getCrmLeads,
  isConfigured,
};
