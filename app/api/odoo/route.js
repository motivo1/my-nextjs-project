import { NextResponse } from "next/server";
import {
  isConfigured,
  getProducts,
  getSaleOrders,
  getContacts,
  getInvoices,
  getInventory,
  getCrmLeads,
  searchRead,
} from "../../../lib/odoo";

export async function POST(request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Odoo not configured. Set ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD in .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { action, model, domain, fields, limit = 20, offset = 0 } = body;

    let data;
    switch (action) {
      case "products":
        data = await getProducts(limit);
        break;
      case "orders":
        data = await getSaleOrders(limit);
        break;
      case "contacts":
        data = await getContacts(limit);
        break;
      case "invoices":
        data = await getInvoices(limit);
        break;
      case "inventory":
        data = await getInventory(limit);
        break;
      case "leads":
        data = await getCrmLeads(limit);
        break;
      case "custom":
        if (!model) {
          return NextResponse.json({ error: "model is required for custom action" }, { status: 400 });
        }
        data = await searchRead(model, domain || [], fields || [], limit, offset);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: products, orders, contacts, invoices, inventory, leads, custom" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, count: data?.length || 0, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isConfigured(),
    odooUrl: process.env.ODOO_URL || "https://dev-erp.asunim.co/odoo",
    actions: ["products", "orders", "contacts", "invoices", "inventory", "leads", "custom"],
  });
}
