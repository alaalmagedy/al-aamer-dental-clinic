// 🏥 نظام المحاسبة لعيادة العامر للأسنان
// Financial System for Al-Aamer Dental Clinic

class AccountingSystem {
    constructor() {
        this.payments = this.loadPayments();
        this.expenses = this.loadExpenses();
        this.invoices = this.loadInvoices();
        this.initializeData();
    }

    // تحميل البيانات من localStorage
    loadPayments() {
        return JSON.parse(localStorage.getItem('dentalClinic_payments') || '[]');
    }

    loadExpenses() {
        return JSON.parse(localStorage.getItem('dentalClinic_expenses') || '[]');
    }

    loadInvoices() {
        return JSON.parse(localStorage.getItem('dentalClinic_invoices') || '[]');
    }

    // حفظ البيانات
    savePayments() {
        localStorage.setItem('dentalClinic_payments', JSON.stringify(this.payments));
    }

    saveExpenses() {
        localStorage.setItem('dentalClinic_expenses', JSON.stringify(this.expenses));
    }

    saveInvoices() {
        localStorage.setItem('dentalClinic_invoices', JSON.stringify(this.invoices));
    }

    // تهيئة البيانات الأساسية
    initializeData() {
        // إضافة مصروفات أساسية إذا لم تكن موجودة
        if (this.expenses.length === 0) {
            this.addExpense('إيجار', 'إيجار العيادة - شهر نوفمبر', 2000, '2025-11-01', 'تحويل بنكي');
            this.addExpense('رواتب', 'راتب الموظفة - شهر نوفمبر', 800, '2025-11-01', 'نقدي');
            this.addExpense('كهرباء', 'فاتورة الكهرباء - أكتوبر', 150, '2025-10-15', 'نقدي');
        }
    }

    // إضافة دفعة جديدة
    addPayment(appointmentData) {
        const payment = {
            id: this.generateId('PAY'),
            appointmentId: appointmentData.id || this.generateId('APP'),
            patientName: appointmentData.patientName,
            patientPhone: appointmentData.patientPhone,
            doctor: appointmentData.doctor,
            service: appointmentData.service,
            amount: appointmentData.amount,
            paymentMethod: appointmentData.paymentMethod || 'نقدي',
            discount: appointmentData.discount || 0,
            netAmount: appointmentData.amount - (appointmentData.discount || 0),
            timestamp: new Date().toISOString(),
            status: 'مكتمل',
            invoiceNumber: this.generateInvoiceNumber()
        };

        this.payments.push(payment);
        this.savePayments();

        // إنشاء فاتورة
        this.createInvoice(payment);

        return payment;
    }

    // إضافة مصروف
    addExpense(category, description, amount, date, paymentMethod) {
        const expense = {
            id: this.generateId('EXP'),
            category: category,
            description: description,
            amount: amount,
            date: date || new Date().toISOString().split('T')[0],
            paymentMethod: paymentMethod || 'نقدي',
            receiptNumber: this.generateId('REC'),
            timestamp: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveExpenses();
        return expense;
    }

    // إنشاء فاتورة
    createInvoice(payment) {
        const invoice = {
            number: payment.invoiceNumber,
            paymentId: payment.id,
            date: new Date().toISOString().split('T')[0],
            patientName: payment.patientName,
            patientPhone: payment.patientPhone,
            items: [
                {
                    service: payment.service,
                    doctor: payment.doctor,
                    quantity: 1,
                    unitPrice: payment.amount,
                    total: payment.netAmount
                }
            ],
            subtotal: payment.amount,
            discount: payment.discount,
            total: payment.netAmount,
            paymentMethod: payment.paymentMethod,
            printed: false
        };

        this.invoices.push(invoice);
        this.saveInvoices();
        return invoice;
    }

    // حساب الإيرادات
    calculateRevenue(period = 'month') {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 1);
                break;
            default:
                startDate = new Date(0);
                endDate = new Date();
        }

        return this.payments.filter(payment => {
            const paymentDate = new Date(payment.timestamp);
            return paymentDate >= startDate && paymentDate < endDate && payment.status === 'مكتمل';
        });
    }

    // حساب المصروفات
    calculateExpenses(period = 'month') {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 1);
                break;
            default:
                startDate = new Date(0);
                endDate = new Date();
        }

        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate < endDate;
        });
    }

    // حساب الربح
    calculateProfit(period = 'month') {
        const revenue = this.calculateRevenue(period);
        const expenses = this.calculateExpenses(period);
        
        const totalRevenue = revenue.reduce((sum, payment) => sum + payment.netAmount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
            revenue: totalRevenue,
            expenses: totalExpenses,
            profit: totalRevenue - totalExpenses,
            profitMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0
        };
    }

    // إحصائيات الأطباء
    getDoctorStatistics(period = 'month') {
        const revenue = this.calculateRevenue(period);
        const doctorStats = {};

        revenue.forEach(payment => {
            if (!doctorStats[payment.doctor]) {
                doctorStats[payment.doctor] = {
                    totalAmount: 0,
                    totalPatients: 0,
                    services: {}
                };
            }
            doctorStats[payment.doctor].totalAmount += payment.netAmount;
            doctorStats[payment.doctor].totalPatients += 1;
            doctorStats[payment.doctor].services[payment.service] = 
                (doctorStats[payment.doctor].services[payment.service] || 0) + 1;
        });

        return doctorStats;
    }

    // إحصائيات الخدمات
    getServiceStatistics(period = 'month') {
        const revenue = this.calculateRevenue(period);
        const serviceStats = {};

        revenue.forEach(payment => {
            if (!serviceStats[payment.service]) {
                serviceStats[payment.service] = {
                    totalAmount: 0,
                    totalPatients: 0,
                    averagePrice: 0
                };
            }
            serviceStats[payment.service].totalAmount += payment.netAmount;
            serviceStats[payment.service].totalPatients += 1;
        });

        // حساب متوسط السعر
        Object.keys(serviceStats).forEach(service => {
            const stat = serviceStats[service];
            stat.averagePrice = stat.totalAmount / stat.totalPatients;
        });

        return serviceStats;
    }

    // توليد معرف فريد
    generateId(prefix) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}_${timestamp}_${random}`;
    }

    // توليد رقم الفاتورة
    generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const count = this.invoices.length + 1;
        return `INV_${count}_${year}`;
    }

    // الحصول على تقرير شهري
    getMonthlyReport(month, year) {
        const targetDate = new Date(year, month - 1, 1);
        const monthName = targetDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
        
        const revenue = this.calculateRevenue('month').filter(payment => {
            const paymentDate = new Date(payment.timestamp);
            return paymentDate.getMonth() === month - 1 && paymentDate.getFullYear() === year;
        });

        const expenses = this.calculateExpenses('month').filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === month - 1 && expenseDate.getFullYear() === year;
        });

        const profit = this.calculateProfit('month');
        const doctorStats = this.getDoctorStatistics('month');
        const serviceStats = this.getServiceStatistics('month');

        return {
            month: monthName,
            year: year,
            revenue: {
                total: revenue.reduce((sum, payment) => sum + payment.netAmount, 0),
                count: revenue.length,
                byDoctor: doctorStats,
                byService: serviceStats
            },
            expenses: {
                total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
                byCategory: this.groupExpensesByCategory(expenses)
            },
            profit: profit,
            period: `${monthName} ${year}`
        };
    }

    // تجميع المصروفات حسب الفئة
    groupExpensesByCategory(expenses) {
        const grouped = {};
        expenses.forEach(expense => {
            if (!grouped[expense.category]) {
                grouped[expense.category] = 0;
            }
            grouped[expense.category] += expense.amount;
        });
        return grouped;
    }

    // تصدير البيانات
    exportData(type = 'all') {
        const data = {};
        
        if (type === 'all' || type === 'payments') {
            data.payments = this.payments;
        }
        if (type === 'all' || type === 'expenses') {
            data.expenses = this.expenses;
        }
        if (type === 'all' || type === 'invoices') {
            data.invoices = this.invoices;
        }

        return data;
    }

    // استيراد البيانات
    importData(data) {
        if (data.payments) {
            this.payments = data.payments;
            this.savePayments();
        }
        if (data.expenses) {
            this.expenses = data.expenses;
            this.saveExpenses();
        }
        if (data.invoices) {
            this.invoices = data.invoices;
            this.saveInvoices();
        }
    }

    // مسح البيانات (للاختبار)
    clearAllData() {
        this.payments = [];
        this.expenses = [];
        this.invoices = [];
        this.savePayments();
        this.saveExpenses();
        this.saveInvoices();
    }
}

// إنشاء مثيل عام من النظام المحاسبي
const accountingSystem = new AccountingSystem();