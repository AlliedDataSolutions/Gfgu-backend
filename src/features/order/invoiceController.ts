import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Order } from "./orderModel";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ["orderLines", "orderLines.product", "orderAddress", "user"],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.orderLines || order.orderLines.length === 0) {
      return res.status(400).json({ message: "No order lines found for this order" });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 850]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 60;

    // Header
    page.drawText("INVOICE", {
      x: 50,
      y,
      size: 26,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.7),
    });
    y -= 40;

    // Shortened Invoice ID
    const shortInvoiceId = order.id.slice(0, 8).toUpperCase();
    page.drawText(`Invoice No: ${shortInvoiceId}`, { x: 50, y, size: 14, font });
    page.drawText(`Date Issued: ${new Date(order.orderDate).toLocaleDateString()}`, { x: 350, y, size: 14, font });
    y -= 30;

    page.drawText(`Status: ${order.status}`, { x: 50, y, size: 14, font });
    y -= 40;

    // From (Company)
    page.drawText("From:", { x: 50, y, size: 14, font: boldFont });
    page.drawText("GFGU Company Inc.", { x: 100, y, size: 12, font });
    page.drawText("123 Business Street", { x: 100, y: y - 15, size: 12, font });
    page.drawText("Business City, AB 00000", { x: 100, y: y - 30, size: 12, font });

    // To (Customer)
    page.drawText("To:", { x: 350, y, size: 14, font: boldFont });

    const customerName = order.user ? `${order.user.firstName} ${order.user.lastName}` : "Customer";
    const customerStreet = order.orderAddress?.streetName || "";
    const customerTown = order.orderAddress?.town || "";
    const customerProvince = order.orderAddress?.province || "";
    const customerPostalCode = order.orderAddress?.postalCode || "";

    page.drawText(customerName, { x: 390, y, size: 12, font });
    page.drawText(customerStreet, { x: 390, y: y - 15, size: 12, font });
    page.drawText(`${customerTown}, ${customerProvince}`, { x: 390, y: y - 30, size: 12, font });
    page.drawText(customerPostalCode, { x: 390, y: y - 45, size: 12, font });
    y -= 80;

    // Items Header
    page.drawText("Item", { x: 50, y, size: 13, font: boldFont });
    page.drawText("Qty", { x: 250, y, size: 13, font: boldFont });
    page.drawText("Unit Price", { x: 320, y, size: 13, font: boldFont });
    page.drawText("Total", { x: 450, y, size: 13, font: boldFont });
    y -= 20;

    page.drawLine({
      start: { x: 50, y },
      end: { x: 550, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 15;

    // List Items
    let subtotal = 0;
    for (const line of order.orderLines) {
      const productName = line.product?.name || "Unnamed Product";
      const unitPrice = Number(line.unitPrice);
      const quantity = line.quantity;
      const total = unitPrice * quantity;
      subtotal += total;

      // Handle wrapping of long product names
      const maxProductWidth = 180;
      const textWidth = font.widthOfTextAtSize(productName, 12);
      const linesNeeded = Math.ceil(textWidth / maxProductWidth);

      for (let i = 0; i < linesNeeded; i++) {
        const textLine = productName.slice(i * 30, (i + 1) * 30);
        page.drawText(textLine, { x: 50, y, size: 12, font });
        if (i === 0) {
          page.drawText(`${quantity}`, { x: 250, y, size: 12, font });
          page.drawText(`$${unitPrice.toFixed(2)}`, { x: 320, y, size: 12, font });
          page.drawText(`$${total.toFixed(2)}`, { x: 450, y, size: 12, font });
        }
        y -= 15;
      }
      y -= 5;
    }

    y -= 20;

    // Subtotal, Processing Fee, Grand Total
    page.drawLine({
      start: { x: 300, y },
      end: { x: 550, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 20;

    page.drawText("Subtotal:", { x: 350, y, size: 12, font: boldFont });
    page.drawText(`$${subtotal.toFixed(2)}`, { x: 450, y, size: 12, font });

    y -= 20;
    page.drawText("Processing Fee:", { x: 350, y, size: 12, font: boldFont });
    page.drawText("$0.00", { x: 450, y, size: 12, font });

    y -= 20;
    page.drawText("Total:", { x: 350, y, size: 14, font: boldFont, color: rgb(0, 0, 0) });
    page.drawText(`$${subtotal.toFixed(2)}`, { x: 450, y, size: 14, font: boldFont, color: rgb(0, 0, 0) });

    y -= 50;

    // Footer
    page.drawText("Thank you for shopping with GFGU Company!", { x: 50, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');
    res.end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
