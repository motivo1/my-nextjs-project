// Odoo external API client using JSON-RPC (/jsonrpc) with API-key auth.
// Odoo API keys are used in place of the password for common.authenticate
// and object.execute_kw (Odoo 14+).

const ODOO_URL = (process.env.ODOO_URL || "https://dev-erp.asunim.co").replace(/\/$/, "");
const ODOO_DB = process.env.ODOO_DB || "";
const ODOO_USERNAME = process.env.ODOO_USERNAME || "";
// Accept either an API key (preferred) or a password.
const ODOO_SECRET = process.env.ODOO_API_KEY || process.env.ODOO_PASSWORD || "";

let uidCache = null;

async function jsonRpc(service, method, args) {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: Date.now(),
      params: { service, method, args },
    }),
  });

  if (!res.ok) {
    throw new Error(`Odoo HTTP error: ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    const msg = data.error.data?.message || data.error.message || "Odoo RPC error";
    throw new Error(msg);
  }
  return data.result;
}

async function authenticate() {
  if (uidCache) return uidCache;

  const uid = await jsonRpc("common", "authenticate", [
    ODOO_DB,
    ODOO_USERNAME,
    ODOO_SECRET,
    {},
  ]);

  if (!uid) {
    throw new Error("Odoo authentication failed — check ODOO_DB, ODOO_USERNAME, ODOO_API_KEY");
  }

  uidCache = uid;
  return uid;
}

async function executeKw(model, method, args = [], kwargs = {}) {
  const uid = await authenticate();
  return jsonRpc("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_SECRET,
    model,
    method,
    args,
    kwargs,
  ]);
}

async function searchRead(model, domain = [], fields = [], limit = 50, offset = 0) {
  return executeKw(model, "search_read", [domain], {
    fields,
    limit,
    offset,
    order: "id desc",
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
  return !!(ODOO_DB && ODOO_USERNAME && ODOO_SECRET);
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
