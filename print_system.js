// 🖨️ نظام الطباعة لعيادة العامر للأسنان
// Print System for Al-Aamer Dental Clinic

class PrintSystem {
    constructor() {
        this.accounting = accountingSystem;
    }

    // طباعة فاتورة
    printInvoice(invoiceNumber) {
        const invoice = this.accounting.invoices.find(inv => inv.number === invoiceNumber);
        if (!invoice) {
            alert('الفاتورة غير موجودة');
            return;
        }

        const html = this.formatInvoiceHTML(invoice);
        this.showPrintWindow(html, `فاتورة-${invoiceNumber}`);
    }

    // طباعة إيصال
    printReceipt(receiptNumber) {
        const payment = this.accounting.payments.find(pay => pay.receiptNumber === receiptNumber);
        if (!payment) {
            alert('الإيصال غير موجود');
            return;
        }

        const html = this.formatReceiptHTML(payment);
        this.showPrintWindow(html, `إيصال-${receiptNumber}`);
    }

    // طباعة تقرير شهري
    printMonthlyReport(month, year) {
        const report = this.accounting.getMonthlyReport(month, year);
        const html = this.formatReportHTML(report);
        this.showPrintWindow(html, `تقرير-${month}-${year}`);
    }

    // طباعة تقرير يومي
    printDailyReport(date) {
        const report = this.generateDailyReport(date);
        const html = this.formatDailyReportHTML(report);
        this.showPrintWindow(html, `تقرير-يومي-${date}`);
    }

    // عرض نافذة الطباعة
    showPrintWindow(content, title) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Cairo', Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.4;
                        color: #000;
                        background: white;
                        direction: rtl;
                    }
                    
                    .print-container {
                        max-width: 210mm;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #2E7D32;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                    }
                    
                    .clinic-name {
                        font-size: 24px;
                        font-weight: bold;
                        color: #2E7D32;
                        margin-bottom: 5px;
                    }
                    
                    .clinic-info {
                        font-size: 12px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    
                    .divider {
                        border-top: 1px solid #000;
                        margin: 15px 0;
                    }
                    
                    .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 15px 0 10px 0;
                        color: #2E7D32;
                    }
                    
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    
                    .info-label {
                        font-weight: bold;
                    }
                    
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 15px 0;
                    }
                    
                    .table th,
                    .table td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: center;
                    }
                    
                    .table th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                    
                    .total-row {
                        font-weight: bold;
                        font-size: 16px;
                        background-color: #f5f5f5;
                    }
                    
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        border-top: 1px solid #000;
                        padding-top: 15px;
                    }
                    
                    .signature-area {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 30px;
                    }
                    
                    .signature-box {
                        width: 200px;
                        text-align: center;
                        border-top: 1px solid #000;
                        padding-top: 5px;
                    }
                    
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        
                        .print-container {
                            margin: 0;
                            padding: 15px;
                        }
                        
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    ${content}
                    <div class="no-print" style="text-align: center; margin-top: 20px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #2E7D32; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            🖨️ طباعة
                        </button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                            ✖️ إغلاق
                        </button>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // تنسيق فاتورة HTML
    formatInvoiceHTML(invoice) {
        return `
            <div class="header">
                <div class="clinic-name">🦷 عيادة العامر للأسنان</div>
                <div class="clinic-info">خور مكسر، عدن - اليمن</div>
                <div class="clinic-info">هاتف: +967 123 456 789</div>
            </div>
            
            <div class="section-title">فاتورة</div>
            
            <div class="info-row">
                <span class="info-label">رقم الفاتورة:</span>
                <span>${invoice.number}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">التاريخ:</span>
                <span>${invoice.date}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">اسم المريض:</span>
                <span>${invoice.patientName}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">رقم الهاتف:</span>
                <span>${invoice.patientPhone}</span>
            </div>
            
            <div class="divider"></div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>الخدمة</th>
                        <th>الطبيب</th>
                        <th>الكمية</th>
                        <th>سعر الوحدة</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.service}</td>
                            <td>${item.doctor}</td>
                            <td>${item.quantity}</td>
                            <td>${item.unitPrice} ريال</td>
                            <td>${item.total} ريال</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="4" style="text-align: right;">الإجمالي:</td>
                        <td>${invoice.subtotal} ريال</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right;">الخصم:</td>
                        <td>${invoice.discount} ريال</td>
                    </tr>
                    <tr class="total-row" style="background-color: #2E7D32; color: white;">
                        <td colspan="4" style="text-align: right;">الصافي:</td>
                        <td>${invoice.total} ريال</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="info-row">
                <span class="info-label">طريقة الدفع:</span>
                <span>${invoice.paymentMethod}</span>
            </div>
            
            <div class="footer">
                <div>شكراً لزيارتكم</div>
                <div style="margin-top: 5px; font-size: 12px; color: #666;">
                    عيادة العامر للأسنان - رائدة في خدمات طب الأسنان
                </div>
            </div>
            
            <div class="signature-area">
                <div class="signature-box">
                    توقيع المريض
                </div>
                <div class="signature-box">
                    خاتم العيادة
                </div>
            </div>
        `;
    }

    // تنسيق إيصال HTML
    formatReceiptHTML(payment) {
        return `
            <div class="header">
                <div class="clinic-name">🦷 إيصال دفع</div>
                <div class="clinic-name">عيادة العامر للأسنان</div>
            </div>
            
            <div class="info-row">
                <span class="info-label">رقم الإيصال:</span>
                <span>${payment.receiptNumber || payment.id}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">التاريخ:</span>
                <span>${new Date(payment.timestamp).toLocaleDateString('ar-EG')}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">الوقت:</span>
                <span>${new Date(payment.timestamp).toLocaleTimeString('ar-EG')}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">المريض:</span>
                <span>${payment.patientName}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="info-row">
                <span class="info-label">الخدمة:</span>
                <span>${payment.service}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">الطبيب:</span>
                <span>${payment.doctor}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">المبلغ:</span>
                <span style="font-size: 18px; font-weight: bold; color: #2E7D32;">
                    ${payment.netAmount} ريال يمني
                </span>
            </div>
            
            <div class="info-row">
                <span class="info-label">طريقة الدفع:</span>
                <span>${payment.paymentMethod}</span>
            </div>
            
            <div class="footer" style="margin-top: 50px;">
                <div>-----------------</div>
                <div style="margin-top: 10px;">خاتم العيادة</div>
            </div>
        `;
    }

    // تنسيق تقرير شهري HTML
    formatReportHTML(report) {
        return `
            <div class="header">
                <div class="clinic-name">📊 تقرير مالي شهري</div>
                <div class="clinic-name">عيادة العامر للأسنان</div>
                <div class="clinic-info">${report.period}</div>
            </div>
            
            <div class="section-title">الملخص المالي</div>
            
            <div class="info-row">
                <span class="info-label">إجمالي الإيرادات:</span>
                <span style="font-size: 16px; font-weight: bold; color: #2E7D32;">
                    ${report.revenue.total.toLocaleString()} ريال
                </span>
            </div>
            
            <div class="info-row">
                <span class="info-label">إجمالي المصروفات:</span>
                <span style="color: #d32f2f;">
                    ${report.expenses.total.toLocaleString()} ريال
                </span>
            </div>
            
            <div class="info-row">
                <span class="info-label">صافي الربح:</span>
                <span style="font-size: 18px; font-weight: bold; color: #2E7D32;">
                    ${report.profit.profit.toLocaleString()} ريال
                </span>
            </div>
            
            <div class="info-row">
                <span class="info-label">نسبة الربح:</span>
                <span>${report.profit.profitMargin}%</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="section-title">إحصائيات الأطباء</div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>الطبيب</th>
                        <th>عدد المرضى</th>
                        <th>إجمالي الإيرادات</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(report.revenue.byDoctor).map(([doctor, stats]) => `
                        <tr>
                            <td>${doctor}</td>
                            <td>${stats.totalPatients}</td>
                            <td>${stats.totalAmount.toLocaleString()} ريال</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="section-title">أفضل الخدمات</div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>الخدمة</th>
                        <th>عدد المرات</th>
                        <th>إجمالي الإيرادات</th>
                        <th>متوسط السعر</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(report.revenue.byService)
                        .sort(([,a], [,b]) => b.totalAmount - a.totalAmount)
                        .slice(0, 5)
                        .map(([service, stats]) => `
                        <tr>
                            <td>${service}</td>
                            <td>${stats.totalPatients}</td>
                            <td>${stats.totalAmount.toLocaleString()} ريال</td>
                            <td>${Math.round(stats.averagePrice)} ريال</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="section-title">المصروفات حسب الفئة</div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>فئة المصروف</th>
                        <th>المبلغ</th>
                        <th>النسبة</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(report.expenses.byCategory).map(([category, amount]) => `
                        <tr>
                            <td>${category}</td>
                            <td>${amount.toLocaleString()} ريال</td>
                            <td>${((amount / report.expenses.total) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <div>إعداد: Mr Technology Solutions</div>
                <div>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</div>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    عيادة العامر للأسنان - خور مكسر، عدن
                </div>
            </div>
        `;
    }

    // تنسيق تقرير يومي HTML
    formatDailyReportHTML(report) {
        return `
            <div class="header">
                <div class="clinic-name">📅 تقرير يومي</div>
                <div class="clinic-name">عيادة العامر للأسنان</div>
                <div class="clinic-info">${report.date}</div>
            </div>
            
            <div class="info-row">
                <span class="info-label">عدد المرضى:</span>
                <span style="font-size: 16px; font-weight: bold;">${report.totalPatients}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">إجمالي الإيرادات:</span>
                <span style="font-size: 16px; font-weight: bold; color: #2E7D32;">
                    ${report.totalRevenue.toLocaleString()} ريال
                </span>
            </div>
            
            <div class="divider"></div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>الوقت</th>
                        <th>المريض</th>
                        <th>الخدمة</th>
                        <th>الطبيب</th>
                        <th>المبلغ</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.payments.map(payment => `
                        <tr>
                            <td>${new Date(payment.timestamp).toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</td>
                            <td>${payment.patientName}</td>
                            <td>${payment.service}</td>
                            <td>${payment.doctor}</td>
                            <td>${payment.netAmount} ريال</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // إنشاء تقرير يومي
    generateDailyReport(date) {
        const targetDate = new Date(date);
        const payments = this.accounting.payments.filter(payment => {
            const paymentDate = new Date(payment.timestamp);
            return paymentDate.toDateString() === targetDate.toDateString();
        });

        return {
            date: targetDate.toLocaleDateString('ar-EG'),
            totalPatients: payments.length,
            totalRevenue: payments.reduce((sum, payment) => sum + payment.netAmount, 0),
            payments: payments
        };
    }

    // طباعة جميع الفواتير غير المطبوعة
    printUnprintedInvoices() {
        const unprintedInvoices = this.accounting.invoices.filter(inv => !inv.printed);
        if (unprintedInvoices.length === 0) {
            alert('جميع الفواتير مطبوعة مسبقاً');
            return;
        }

        unprintedInvoices.forEach(invoice => {
            this.printInvoice(invoice.number);
            // تحديث حالة الطباعة
            invoice.printed = true;
        });
        
        this.accounting.saveInvoices();
        alert(`تم طباعة ${unprintedInvoices.length} فاتورة`);
    }

    // طباعة إيصالات اليوم
    printTodayReceipts() {
        const today = new Date().toDateString();
        const todayPayments = this.accounting.payments.filter(payment => {
            const paymentDate = new Date(payment.timestamp);
            return paymentDate.toDateString() === today;
        });

        if (todayPayments.length === 0) {
            alert('لا توجد إيصالات لليوم');
            return;
        }

        todayPayments.forEach(payment => {
            this.printReceipt(payment.receiptNumber || payment.id);
        });
    }
}

// إنشاء مثيل عام من نظام الطباعة
const printSystem = new PrintSystem();