/**
 * الميزات المتقدمة لعيادة العامر للأسنان
 * نظام التحليلات، التقارير، والميزات الاحترافية
 */

class AdvancedAnalytics {
    constructor() {
        this.data = this.loadAnalyticsData();
        this.reports = new Map();
    }

    loadAnalyticsData() {
        try {
            const saved = localStorage.getItem('alAamerAnalytics');
            return saved ? JSON.parse(saved) : this.initializeDefaultData();
        } catch (error) {
            console.error('خطأ في تحميل البيانات التحليلية:', error);
            return this.initializeDefaultData();
        }
    }

    initializeDefaultData() {
        return {
            dailyStats: {},
            monthlyStats: {},
            doctorStats: {},
            serviceStats: {},
            patientStats: {},
            revenueStats: {},
            peakHours: {},
            popularServices: {},
            trends: []
        };
    }

    saveAnalyticsData() {
        try {
            localStorage.setItem('alAamerAnalytics', JSON.stringify(this.data));
        } catch (error) {
            console.error('خطأ في حفظ البيانات التحليلية:', error);
        }
    }

    // إحصائيات متقدمة
    calculateAdvancedStatistics() {
        const stats = {
            totalPatients: this.getTotalPatients(),
            todayAppointments: this.getTodayAppointments(),
            monthlyRevenue: this.getMonthlyRevenue(),
            weeklyGrowth: this.getWeeklyGrowth(),
            attendanceRate: this.getAttendanceRate(),
            popularDoctor: this.getMostPopularDoctor(),
            peakDay: this.getPeakDay(),
            averageWaitTime: this.getAverageWaitTime(),
            patientSatisfaction: this.getPatientSatisfaction()
        };

        return stats;
    }

    getTotalPatients() {
        const uniquePatients = new Set();
        window.alAamerDental.appointments.forEach(apt => {
            uniquePatients.add(apt.patientPhone);
        });
        return uniquePatients.size;
    }

    getTodayAppointments() {
        const today = new Date().toISOString().split('T')[0];
        return window.alAamerDental.appointments.filter(apt => apt.date === today).length;
    }

    getMonthlyRevenue() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return window.alAamerDental.appointments
            .filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getMonth() === currentMonth && 
                       aptDate.getFullYear() === currentYear &&
                       apt.status === 'completed';
            })
            .reduce((sum, apt) => {
                const service = window.alAamerDental.servicesData[apt.service];
                return sum + (service ? service.price : 0);
            }, 0);
    }

    getWeeklyGrowth() {
        const now = new Date();
        const thisWeek = this.getWeekRange(now);
        const lastWeek = this.getWeekRange(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        
        const thisWeekAppointments = window.alAamerDental.appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= thisWeek.start && aptDate <= thisWeek.end;
        }).length;

        const lastWeekAppointments = window.alAamerDental.appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= lastWeek.start && aptDate <= lastWeek.end;
        }).length;

        if (lastWeekAppointments === 0) return 100;
        return Math.round(((thisWeekAppointments - lastWeekAppointments) / lastWeekAppointments) * 100);
    }

    getWeekRange(date) {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }

    getAttendanceRate() {
        const totalAppointments = window.alAamerDental.appointments.length;
        const completedAppointments = window.alAamerDental.appointments.filter(apt => apt.status === 'completed').length;
        
        return totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    }

    getMostPopularDoctor() {
        const doctorAppointments = {};
        
        window.alAamerDental.appointments.forEach(apt => {
            doctorAppointments[apt.doctor] = (doctorAppointments[apt.doctor] || 0) + 1;
        });

        const mostPopular = Object.keys(doctorAppointments).reduce((a, b) => 
            doctorAppointments[a] > doctorAppointments[b] ? a : b
        );

        return window.alAamerDental.doctorsData[mostPopular]?.name || 'غير محدد';
    }

    getPeakDay() {
        const dayAppointments = {};
        
        window.alAamerDental.appointments.forEach(apt => {
            const dayName = this.getDayName(new Date(apt.date).getDay());
            dayAppointments[dayName] = (dayAppointments[dayName] || 0) + 1;
        });

        return Object.keys(dayAppointments).reduce((a, b) => 
            dayAppointments[a] > dayAppointments[b] ? a : b
        ) || 'الاثنين';
    }

    getDayName(dayIndex) {
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return days[dayIndex];
    }

    getAverageWaitTime() {
        // محاكاة وقت الانتظار بناءً على حجم العمل
        const totalAppointments = window.alAamerDental.appointments.length;
        return Math.max(0, 15 - Math.floor(totalAppointments / 10));
    }

    getPatientSatisfaction() {
        // محاكاة معدل الرضا بناءً على الإحصائيات
        const attendanceRate = this.getAttendanceRate();
        return Math.min(100, attendanceRate + Math.random() * 10);
    }

    // تحليل ساعات الذروة
    analyzePeakHours() {
        const hourAppointments = {};
        
        window.alAamerDental.appointments.forEach(apt => {
            const hour = apt.time.split(':')[0];
            hourAppointments[hour] = (hourAppointments[hour] || 0) + 1;
        });

        // ترتيب الأوقات حسب عدد المواعيد
        const sortedHours = Object.entries(hourAppointments)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return sortedHours.map(([hour, count]) => ({
            hour: parseInt(hour),
            appointments: count,
            display: `${hour}:00 - ${hour}:59`
        }));
    }

    // تحليل الخدمات الشائعة
    analyzePopularServices() {
        const serviceAppointments = {};
        
        window.alAamerDental.appointments.forEach(apt => {
            serviceAppointments[apt.service] = (serviceAppointments[apt.service] || 0) + 1;
        });

        // ترتيب الخدمات حسب عدد الحجوزات
        const sortedServices = Object.entries(serviceAppointments)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return sortedServices.map(([serviceId, count]) => ({
            service: window.alAamerDental.servicesData[serviceId]?.name || serviceId,
            appointments: count,
            percentage: Math.round((count / window.alAamerDental.appointments.length) * 100)
        }));
    }

    // تقرير شامل
    generateComprehensiveReport() {
        const report = {
            clinicName: window.alAamerDental.clinicSettings.name,
            generationDate: new Date().toISOString(),
            summary: this.calculateAdvancedStatistics(),
            peakHours: this.analyzePeakHours(),
            popularServices: this.analyzePopularServices(),
            monthlyTrend: this.generateMonthlyTrend(),
            doctorPerformance: this.analyzeDoctorPerformance(),
            revenueAnalysis: this.analyzeRevenue(),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    generateMonthlyTrend() {
        const monthlyData = {};
        
        window.alAamerDental.appointments.forEach(apt => {
            const monthYear = apt.date.split('-').slice(0, 2).join('-');
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
        });

        return Object.entries(monthlyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, appointments]) => ({
                month,
                appointments,
                growth: 0 // يمكن حساب النمو هنا
            }));
    }

    analyzeDoctorPerformance() {
        const doctorPerformance = {};
        
        Object.keys(window.alAamerDental.doctorsData).forEach(doctorId => {
            const doctorAppointments = window.alAamerDental.appointments.filter(apt => apt.doctor === doctorId);
            const completedAppointments = doctorAppointments.filter(apt => apt.status === 'completed');
            
            doctorPerformance[doctorId] = {
                name: window.alAamerDental.doctorsData[doctorId].name,
                totalAppointments: doctorAppointments.length,
                completedAppointments: completedAppointments.length,
                attendanceRate: doctorAppointments.length > 0 ? 
                    Math.round((completedAppointments.length / doctorAppointments.length) * 100) : 0,
                revenue: completedAppointments.reduce((sum, apt) => {
                    const service = window.alAamerDental.servicesData[apt.service];
                    return sum + (service ? service.price : 0);
                }, 0)
            };
        });

        return Object.values(doctorPerformance);
    }

    analyzeRevenue() {
        const monthlyRevenue = {};
        
        window.alAamerDental.appointments
            .filter(apt => apt.status === 'completed')
            .forEach(apt => {
                const monthYear = apt.date.split('-').slice(0, 2).join('-');
                const service = window.alAamerDental.servicesData[apt.service];
                const revenue = service ? service.price : 0;
                
                monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + revenue;
            });

        return Object.entries(monthlyRevenue)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, revenue]) => ({ month, revenue }));
    }

    generateRecommendations() {
        const recommendations = [];
        const stats = this.calculateAdvancedStatistics();
        const peakHours = this.analyzePeakHours();
        const popularServices = this.analyzePopularServices();

        // توصيات بناءً على ساعات الذروة
        if (peakHours.length > 0) {
            const topHour = peakHours[0];
            recommendations.push({
                type: 'operational',
                priority: 'high',
                message: `ساعة الذروة في العيادة هي ${topHour.display}. يُنصح بزيادة عدد الأطباء في هذا الوقت.`
            });
        }

        // توصيات بناءً على الخدمات الشائعة
        if (popularServices.length > 0) {
            const topService = popularServices[0];
            recommendations.push({
                type: 'service',
                priority: 'medium',
                message: `الخدمة الأكثر طلباً هي "${topService.service}". يُنصح بالتركيز على تطوير هذه الخدمة.`
            });
        }

        // توصيات بناءً على معدل الحضور
        if (stats.attendanceRate < 80) {
            recommendations.push({
                type: 'customer',
                priority: 'high',
                message: `معدل الحضور ${stats.attendanceRate}%. يُنصح بتحسين نظام التذكيرات.`
            });
        }

        // توصيات بناءً على النمو
        if (stats.weeklyGrowth < 0) {
            recommendations.push({
                type: 'marketing',
                priority: 'high',
                message: `انخفاض في النمو بنسبة ${Math.abs(stats.weeklyGrowth)}%. يُنصح بتعزيز جهود التسويق.`
            });
        }

        return recommendations;
    }
}

// نظام إشعارات متقدم
class AdvancedNotificationSystem {
    constructor() {
        this.queue = [];
        this.settings = this.loadNotificationSettings();
    }

    loadNotificationSettings() {
        try {
            const saved = localStorage.getItem('alAamerNotificationSettings');
            return saved ? JSON.parse(saved) : this.getDefaultSettings();
        } catch (error) {
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            email: true,
            sms: true,
            whatsapp: true,
            push: true,
            sound: true,
            timing: {
                reminder24h: true,
                reminder2h: true,
                confirmation: true,
                cancellation: true
            }
        };
    }

    // إشعار بحجز جديد
    notifyNewAppointment(appointment) {
        const doctor = window.alAamerDental.doctorsData[appointment.doctor];
        const service = window.alAamerDental.servicesData[appointment.service];
        
        const notifications = [];

        // إشعار للعيادة
        if (this.settings.email) {
            notifications.push({
                type: 'email',
                to: window.alAamerDental.clinicSettings.email,
                subject: 'موعد جديد - عيادة العامر للأسنان',
                message: `موعد جديد:\nالمريض: ${appointment.patientName}\nالطبيب: ${doctor.name}\nالخدمة: ${service.name}\nالتاريخ: ${appointment.date}\nالوقت: ${appointment.time}`
            });
        }

        // إشعار واتساب للعيادة
        if (this.settings.whatsapp) {
            notifications.push({
                type: 'whatsapp',
                to: window.alAamerDental.clinicSettings.phone,
                message: `موعد جديد!\n👤 المريض: ${appointment.patientName}\n👨‍⚕️ الطبيب: ${doctor.name}\n🦷 الخدمة: ${service.name}\n📅 التاريخ: ${appointment.date}\n⏰ الوقت: ${appointment.time}`
            });
        }

        // إشعار للمريض
        if (this.settings.sms && appointment.patientPhone) {
            notifications.push({
                type: 'sms',
                to: appointment.patientPhone,
                message: `تم حجز موعدك في عيادة العامر للأسنان\nالتاريخ: ${appointment.date}\nالوقت: ${appointment.time}\nالطبيب: ${doctor.name}\nرقم الحجز: ${appointment.id}`
            });
        }

        this.queueNotifications(notifications);
    }

    // تذكير بموعد
    sendAppointmentReminder(appointment, hoursBefore) {
        const doctor = window.alAamerDental.doctorsData[appointment.doctor];
        
        const message = hoursBefore === 24 ? 
            `تذكير: لديك موعد غداً مع ${doctor.name}\nالتاريخ: ${appointment.date}\nالوقت: ${appointment.time}` :
            `تذكير: موعدك مع ${doctor.name} بعد ساعتين!\nيرجى الحضور قبل الموعد بـ 15 دقيقة`;

        const notifications = [];

        if (appointment.smsReminder && appointment.patientPhone) {
            notifications.push({
                type: 'sms',
                to: appointment.patientPhone,
                message
            });
        }

        if (appointment.whatsappReminder && appointment.patientPhone) {
            const phone = appointment.patientPhone.replace(/\+/g, '').replace(/0/g, '967');
            notifications.push({
                type: 'whatsapp',
                to: `https://wa.me/${phone}`,
                message
            });
        }

        this.queueNotifications(notifications);
    }

    queueNotifications(notifications) {
        notifications.forEach(notification => {
            this.queue.push({
                ...notification,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
        });

        this.processNotificationQueue();
    }

    async processNotificationQueue() {
        while (this.queue.length > 0) {
            const notification = this.queue.shift();
            
            try {
                await this.sendNotification(notification);
                notification.status = 'sent';
            } catch (error) {
                console.error('خطأ في إرسال الإشعار:', error);
                notification.status = 'failed';
                notification.error = error.message;
            }

            this.saveNotificationLog(notification);
        }
    }

    async sendNotification(notification) {
        switch (notification.type) {
            case 'email':
                // محاكاة إرسال إيميل
                console.log('إرسال إيميل:', notification);
                await this.simulateDelay(1000);
                break;
                
            case 'sms':
                // محاكاة إرسال SMS
                console.log('إرسال SMS:', notification);
                await this.simulateDelay(500);
                break;
                
            case 'whatsapp':
                // فتح واتساب
                window.open(notification.to, '_blank');
                await this.simulateDelay(2000);
                break;
                
            case 'push':
                // إشعار المتصفح
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/favicon.ico'
                    });
                }
                break;
        }
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    saveNotificationLog(notification) {
        try {
            const logs = JSON.parse(localStorage.getItem('alAamerNotificationLog') || '[]');
            logs.push(notification);
            
            // الاحتفاظ بآخر 100 إشعار فقط
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem('alAamerNotificationLog', JSON.stringify(logs));
        } catch (error) {
            console.error('خطأ في حفظ سجل الإشعارات:', error);
        }
    }
}

// نظام إدارة البيانات المتقدم
class AdvancedDataManagement {
    constructor() {
        this.encryptionKey = this.generateEncryptionKey();
    }

    generateEncryptionKey() {
        // محاكاة مفتاح تشفير
        return 'alAamerDental2025_' + Math.random().toString(36).substr(2, 16);
    }

    // تشفير البيانات الحساسة
    encryptData(data) {
        try {
            // في التطبيق الحقيقي، استخدم مكتبة تشفير قوية
            const jsonString = JSON.stringify(data);
            return btoa(jsonString); // Base64 encoding (للعرض فقط)
        } catch (error) {
            console.error('خطأ في تشفير البيانات:', error);
            return data;
        }
    }

    // فك تشفير البيانات
    decryptData(encryptedData) {
        try {
            const jsonString = atob(encryptedData);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('خطأ في فك تشفير البيانات:', error);
            return encryptedData;
        }
    }

    // إنشاء نسخة احتياطية متقدمة
    createAdvancedBackup(includeAnalytics = true) {
        const backup = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            clinicInfo: window.alAamerDental.clinicSettings,
            appointments: window.alAamerDental.appointments,
            settings: this.loadAdvancedSettings(),
            analytics: includeAnalytics ? window.analyticsSystem.data : null
        };

        // تشفير البيانات الحساسة
        backup.encryptedAppointments = this.encryptData(backup.appointments);
        delete backup.appointments; // حذف النسخة غير المشفرة

        const backupContent = JSON.stringify(backup, null, 2);
        const backupName = `al-aamer-advanced-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        this.downloadFile(backupContent, backupName, 'application/json');
        
        return backupName;
    }

    loadAdvancedSettings() {
        try {
            return JSON.parse(localStorage.getItem('alAamerAdvancedSettings') || '{}');
        } catch (error) {
            return {};
        }
    }

    saveAdvancedSettings(settings) {
        try {
            localStorage.setItem('alAamerAdvancedSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات المتقدمة:', error);
        }
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // استعادة من نسخة احتياطية
    restoreFromBackup(backupFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // فك تشفير المواعيد
                    if (backup.encryptedAppointments) {
                        window.alAamerDental.appointments = this.decryptData(backup.encryptedAppointments);
                    }
                    
                    // استعادة الإعدادات
                    if (backup.settings) {
                        this.saveAdvancedSettings(backup.settings);
                    }
                    
                    // حفظ في localStorage
                    localStorage.setItem('alAamerDentalAppointments', JSON.stringify(window.alAamerDental.appointments));
                    
                    resolve({ success: true, message: 'تم استعادة النسخة الاحتياطية بنجاح' });
                } catch (error) {
                    reject({ success: false, message: 'خطأ في قراءة النسخة الاحتياطية' });
                }
            };
            
            reader.onerror = () => {
                reject({ success: false, message: 'خطأ في قراءة الملف' });
            };
            
            reader.readAsText(backupFile);
        });
    }
}

// نظام التصدير المتقدم
class AdvancedExportSystem {
    constructor() {
        this.formats = ['csv', 'excel', 'pdf', 'json'];
    }

    // تصدير شامل
    exportComprehensiveData(format = 'excel') {
        const data = {
            clinic: window.alAamerDental.clinicSettings,
            appointments: window.alAamerDental.appointments,
            analytics: window.analyticsSystem ? window.analyticsSystem.calculateAdvancedStatistics() : null,
            reports: window.analyticsSystem ? window.analyticsSystem.generateComprehensiveReport() : null,
            exportDate: new Date().toISOString()
        };

        switch(format) {
            case 'csv':
                return this.exportToCSV(data);
            case 'excel':
                return this.exportToExcel(data);
            case 'pdf':
                return this.exportToPDF(data);
            case 'json':
                return this.exportToJSON(data);
            default:
                throw new Error('تنسيق تصدير غير مدعوم');
        }
    }

    exportToCSV(data) {
        let csv = '';
        
        // معلومات العيادة
        csv += 'معلومات العيادة\n';
        csv += `الاسم,${data.clinic.name}\n`;
        csv += `العنوان,${data.clinic.address}\n`;
        csv += `الهاتف,${data.clinic.phone}\n\n`;
        
        // المواعيد
        csv += 'المواعيد\n';
        csv += 'التاريخ,الوقت,الطبيب,الخدمة,المريض,الهاتف,الحالة,السعر\n';
        
        data.appointments.forEach(apt => {
            const doctor = window.alAamerDental.doctorsData[apt.doctor];
            const service = window.alAamerDental.servicesData[apt.service];
            csv += `${apt.date},${apt.time},${doctor?.name || apt.doctor},${service?.name || apt.service},${apt.patientName},${apt.patientPhone},${apt.status},${service?.price || 0}\n`;
        });
        
        return csv;
    }

    exportToJSON(data) {
        return JSON.stringify(data, null, 2);
    }

    exportToExcel(data) {
        // محاكاة تصدير Excel
        const excelData = {
            clinics: [data.clinic],
            appointments: data.appointments,
            summary: data.analytics
        };
        
        const jsonString = JSON.stringify(excelData);
        this.downloadFile(jsonString, `al-aamer-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    }

    exportToPDF(data) {
        // محاكاة تصدير PDF
        const reportContent = this.generatePDFContent(data);
        const htmlContent = this.wrapInHTML(reportContent);
        
        this.downloadFile(htmlContent, `al-aamer-report-${new Date().toISOString().split('T')[0]}.html`, 'text/html');
    }

    generatePDFContent(data) {
        let content = `
            <h1>تقرير عيادة العامر للأسنان</h1>
            <p>تاريخ التصدير: ${new Date().toLocaleDateString('ar-YE')}</p>
            
            <h2>معلومات العيادة</h2>
            <ul>
                <li>الاسم: ${data.clinic.name}</li>
                <li>العنوان: ${data.clinic.address}</li>
                <li>الهاتف: ${data.clinic.phone}</li>
            </ul>
            
            <h2>الإحصائيات</h2>
            <ul>
                <li>إجمالي المواعيد: ${data.appointments.length}</li>
                <li>عدد المرضى: ${new Set(data.appointments.map(apt => apt.patientPhone)).size}</li>
            </ul>
            
            <h2>قائمة المواعيد</h2>
            <table border="1">
                <tr>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>الطبيب</th>
                    <th>المريض</th>
                </tr>
        `;
        
        data.appointments.forEach(apt => {
            const doctor = window.alAamerDental.doctorsData[apt.doctor];
            content += `
                <tr>
                    <td>${apt.date}</td>
                    <td>${apt.time}</td>
                    <td>${doctor?.name || apt.doctor}</td>
                    <td>${apt.patientName}</td>
                </tr>
            `;
        });
        
        content += '</table>';
        return content;
    }

    wrapInHTML(content) {
        return `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>تقرير عيادة العامر</title>
                <style>
                    body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                    h1, h2 { color: #2E7D32; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// تهيئة النظام المتقدم
function initializeAdvancedSystem() {
    console.log('تهيئة النظام المتقدم لعيادة العامر...');
    
    // تهيئة نظام التحليلات
    window.analyticsSystem = new AdvancedAnalytics();
    
    // تهيئة نظام الإشعارات
    window.notificationSystem = new AdvancedNotificationSystem();
    
    // تهيئة إدارة البيانات
    window.dataManager = new AdvancedDataManagement();
    
    // تهيئة نظام التصدير
    window.exportSystem = new AdvancedExportSystem();
    
    // ربط الدوال العامة
    window.generateAdvancedReport = () => {
        return window.analyticsSystem.generateComprehensiveReport();
    };
    
    window.exportAdvancedData = (format) => {
        return window.exportSystem.exportComprehensiveData(format);
    };
    
    window.createAdvancedBackup = () => {
        return window.dataManager.createAdvancedBackup(true);
    };
    
    window.sendTestNotification = () => {
        const testAppointment = {
            patientName: 'اختبار',
            patientPhone: '+967123456789',
            doctor: 'dr-aamer',
            service: 'examination',
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            smsReminder: true,
            whatsappReminder: true
        };
        window.notificationSystem.sendAppointmentReminder(testAppointment, 2);
    };
    
    console.log('تم تهيئة النظام المتقدم بنجاح');
}

// تحميل النظام المتقدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تأخير التهيئة قليلاً لضمان تحميل النظام الأساسي أولاً
    setTimeout(initializeAdvancedSystem, 1000);
});

// تصدير الكلاسات للاستخدام الخارجي
window.AlAamerAdvanced = {
    AdvancedAnalytics,
    AdvancedNotificationSystem,
    AdvancedDataManagement,
    AdvancedExportSystem
};

console.log('تم تحميل الميزات المتقدمة لعيادة العامر للأسنان');