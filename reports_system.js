// 📊 نظام التقارير المتقدم لعيادة العامر للأسنان
// Advanced Reports System for Al-Aamer Dental Clinic

class ReportsSystem {
    constructor() {
        this.accounting = accountingSystem;
        this.print = printSystem;
    }

    // تقرير شامل شهري
    generateComprehensiveMonthlyReport(month, year) {
        const report = this.accounting.getMonthlyReport(month, year);
        
        // إضافة تحليلات متقدمة
        report.analysis = this.analyzeMonthlyData(report);
        report.comparisons = this.compareWithPreviousMonths(report, month, year);
        report.recommendations = this.generateRecommendations(report);
        report.forecasts = this.generateForecasts(report);
        
        return report;
    }

    // تحليل البيانات الشهرية
    analyzeMonthlyData(report) {
        const analysis = {
            growth: this.calculateGrowthRate(report),
            performance: this.analyzePerformance(report),
            trends: this.identifyTrends(report),
            insights: this.generateInsights(report)
        };
        
        return analysis;
    }

    // حساب معدل النمو
    calculateGrowthRate(report) {
        // مقارنة مع الشهر السابق
        const previousMonth = this.getPreviousMonth(report.year, report.month);
        if (!previousMonth) return { revenue: 0, patients: 0, profit: 0 };
        
        const prevReport = this.accounting.getMonthlyReport(previousMonth.month, previousMonth.year);
        
        return {
            revenue: this.calculatePercentageChange(report.revenue.total, prevReport.revenue.total),
            patients: this.calculatePercentageChange(report.revenue.count, prevReport.revenue.count),
            profit: this.calculatePercentageChange(report.profit.profit, prevReport.profit.profit)
        };
    }

    // حساب نسبة التغيير
    calculatePercentageChange(current, previous) {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(1);
    }

    // تحليل الأداء
    analyzePerformance(report) {
        const doctorStats = report.revenue.byDoctor;
        const serviceStats = report.revenue.byService;
        
        const topDoctor = Object.entries(doctorStats)
            .sort(([,a], [,b]) => b.totalAmount - a.totalAmount)[0];
        
        const topService = Object.entries(serviceStats)
            .sort(([,a], [,b]) => b.totalAmount - a.totalAmount)[0];
        
        const avgTicketSize = report.revenue.total / report.revenue.count;
        
        return {
            topDoctor: {
                name: topDoctor[0],
                revenue: topDoctor[1].totalAmount,
                patients: topDoctor[1].totalPatients,
                avgPerPatient: (topDoctor[1].totalAmount / topDoctor[1].totalPatients).toFixed(0)
            },
            topService: {
                name: topService[0],
                revenue: topService[1].totalAmount,
                count: topService[1].totalPatients,
                avgPrice: Math.round(topService[1].averagePrice)
            },
            avgTicketSize: Math.round(avgTicketSize),
            dailyAvg: Math.round(report.revenue.total / new Date(report.year, month - 1).getDate()),
            patientRetention: this.calculatePatientRetention(report)
        };
    }

    // حساب معدل الاحتفاظ بالعملاء
    calculatePatientRetention(report) {
        const uniquePatients = new Set(this.accounting.payments
            .filter(payment => {
                const paymentDate = new Date(payment.timestamp);
                return paymentDate.getMonth() === report.month - 1 && 
                       paymentDate.getFullYear() === report.year;
            })
            .map(payment => payment.patientPhone)
        ).size;
        
        return (uniquePatients / report.revenue.count * 100).toFixed(1);
    }

    // تحديد الاتجاهات
    identifyTrends(report) {
        const trends = {
            peakDays: this.identifyPeakDays(report),
            peakHours: this.identifyPeakHours(report),
            seasonalPattern: this.analyzeSeasonalPattern(report),
            paymentTrends: this.analyzePaymentTrends(report)
        };
        
        return trends;
    }

    // تحديد أيام الذروة
    identifyPeakDays(report) {
        const dailyRevenue = {};
        
        this.accounting.payments
            .filter(payment => {
                const paymentDate = new Date(payment.timestamp);
                return paymentDate.getMonth() === report.month - 1 && 
                       paymentDate.getFullYear() === report.year;
            })
            .forEach(payment => {
                const day = new Date(payment.timestamp).toLocaleDateString('ar-EG', { weekday: 'long' });
                dailyRevenue[day] = (dailyRevenue[day] || 0) + payment.netAmount;
            });
        
        return Object.entries(dailyRevenue)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([day, amount]) => ({ day, amount }));
    }

    // تحديد ساعات الذروة
    identifyPeakHours(report) {
        const hourlyRevenue = {};
        
        this.accounting.payments
            .filter(payment => {
                const paymentDate = new Date(payment.timestamp);
                return paymentDate.getMonth() === report.month - 1 && 
                       paymentDate.getFullYear() === report.year;
            })
            .forEach(payment => {
                const hour = new Date(payment.timestamp).getHours();
                hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + payment.netAmount;
            });
        
        return Object.entries(hourlyRevenue)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour, amount]) => ({ 
                hour: `${hour}:00`, 
                amount,
                timePeriod: this.getTimePeriod(parseInt(hour))
            }));
    }

    // تحديد الفترة الزمنية
    getTimePeriod(hour) {
        if (hour >= 6 && hour < 12) return 'الصباح';
        if (hour >= 12 && hour < 18) return 'بعد الظهر';
        if (hour >= 18 && hour < 22) return 'المساء';
        return 'الليل';
    }

    // تحليل الأنماط الموسمية
    analyzeSeasonalPattern(report) {
        // مقارنة مع نفس الشهر في السنوات السابقة
        const historicalData = [];
        
        for (let year = 2020; year <= report.year; year++) {
            if (year === report.year) continue;
            
            const data = this.accounting.getMonthlyReport(report.month, year);
            historicalData.push({
                year: year,
                revenue: data.revenue.total,
                patients: data.revenue.count
            });
        }
        
        if (historicalData.length === 0) return null;
        
        const avgRevenue = historicalData.reduce((sum, data) => sum + data.revenue, 0) / historicalData.length;
        const currentRevenue = report.revenue.total;
        
        return {
            average: Math.round(avgRevenue),
            current: currentRevenue,
            variance: ((currentRevenue - avgRevenue) / avgRevenue * 100).toFixed(1),
            trend: currentRevenue > avgRevenue ? 'تصاعدي' : 'تنازلي'
        };
    }

    // تحليل اتجاهات الدفع
    analyzePaymentTrends(report) {
        const paymentMethods = {};
        
        this.accounting.payments
            .filter(payment => {
                const paymentDate = new Date(payment.timestamp);
                return paymentDate.getMonth() === report.month - 1 && 
                       paymentDate.getFullYear() === report.year;
            })
            .forEach(payment => {
                paymentMethods[payment.paymentMethod] = 
                    (paymentMethods[payment.paymentMethod] || 0) + 1;
            });
        
        return Object.entries(paymentMethods)
            .sort(([,a], [,b]) => b - a)
            .map(([method, count]) => ({
                method,
                count,
                percentage: (count / report.revenue.count * 100).toFixed(1)
            }));
    }

    // توليد الرؤى
    generateInsights(report) {
        const insights = [];
        
        // تحليل ربحية الخدمات
        const highValueServices = Object.entries(report.revenue.byService)
            .filter(([, stats]) => stats.totalPatients >= 5)
            .sort(([,a], [,b]) => b.averagePrice - a.averagePrice);
        
        if (highValueServices.length > 0) {
            insights.push({
                type: 'إيرادات',
                message: `الخدمة الأكثر ربحية هي "${highValueServices[0][0]}" بمتوسط سعر ${Math.round(highValueServices[0][1].averagePrice)} ريال`
            });
        }
        
        // تحليل توزيع العمل
        const doctorLoad = Object.entries(report.revenue.byDoctor)
            .sort(([,a], [,b]) => b.totalPatients - a.totalPatients);
        
        if (doctorLoad.length > 0) {
            const maxPatients = doctorLoad[0][1].totalPatients;
            const minPatients = doctorLoad[doctorLoad.length - 1][1].totalPatients;
            
            if (maxPatients - minPatients > 10) {
                insights.push({
                    type: 'توزيع العمل',
                    message: `يوجد عدم توازن في توزيع المرضى بين الأطباء - يجب مراجعة جداول المواعيد`
                });
            }
        }
        
        // تحليل الربحية
        if (report.profit.profitMargin < 30) {
            insights.push({
                type: 'ربحية',
                message: `نسبة الربح منخفضة (${report.profit.profitMargin}%) - يجب مراجعة المصروفات أو زيادة الأسعار`
            });
        }
        
        return insights;
    }

    // مقارنة مع الشهور السابقة
    compareWithPreviousMonths(report, month, year) {
        const comparisons = [];
        
        // مقارنة مع الشهر السابق
        const prevMonth = this.getPreviousMonth(year, month);
        if (prevMonth) {
            const prevReport = this.accounting.getMonthlyReport(prevMonth.month, prevMonth.year);
            comparisons.push({
                period: 'الشهر السابق',
                revenue: {
                    current: report.revenue.total,
                    previous: prevReport.revenue.total,
                    change: this.calculatePercentageChange(report.revenue.total, prevReport.revenue.total)
                },
                patients: {
                    current: report.revenue.count,
                    previous: prevReport.revenue.count,
                    change: this.calculatePercentageChange(report.revenue.count, prevReport.revenue.count)
                }
            });
        }
        
        // مقارنة مع نفس الشهر في العام السابق
        if (year > 2020) {
            const sameMonthLastYear = this.accounting.getMonthlyReport(month, year - 1);
            if (sameMonthLastYear) {
                comparisons.push({
                    period: 'نفس الشهر العام الماضي',
                    revenue: {
                        current: report.revenue.total,
                        previous: sameMonthLastYear.revenue.total,
                        change: this.calculatePercentageChange(report.revenue.total, sameMonthLastYear.revenue.total)
                    },
                    patients: {
                        current: report.revenue.count,
                        previous: sameMonthLastYear.revenue.count,
                        change: this.calculatePercentageChange(report.revenue.count, sameMonthLastYear.revenue.count)
                    }
                });
            }
        }
        
        return comparisons;
    }

    // الحصول على الشهر السابق
    getPreviousMonth(year, month) {
        if (month === 1) {
            return { month: 12, year: year - 1 };
        } else {
            return { month: month - 1, year: year };
        }
    }

    // توليد التوصيات
    generateRecommendations(report) {
        const recommendations = [];
        
        // توصيات بناء على الأداء
        if (report.analysis.performance.avgTicketSize < 80) {
            recommendations.push({
                priority: 'عالية',
                category: 'الأسعار',
                title: 'زيادة متوسط قيمة التذكرة',
                description: 'متوسط قيمة التذكرة منخفضة - يُنصح بعرض خدمات إضافية أو باقات متكاملة',
                action: 'إنشاء عروض باقات شاملة مع خصومات'
            });
        }
        
        // توصيات بناء على ساعات الذروة
        const peakHours = report.analysis.trends.peakHours;
        if (peakHours.length > 0 && peakHours[0].hour < '10:00') {
            recommendations.push({
                priority: 'متوسطة',
                category: 'الجدولة',
                title: 'تحسين توزيع المواعيد',
                description: 'معظم النشاط في الصباح الباكر - يجب توزيع المواعيد بشكل أفضل',
                action: 'إنشاء عروض للزيارات المسائية'
            });
        }
        
        // توصيات بناء على ربحية الأطباء
        const doctorPerformance = Object.entries(report.revenue.byDoctor)
            .sort(([,a], [,b]) => b.totalAmount - a.totalAmount);
        
        if (doctorPerformance.length > 0) {
            recommendations.push({
                priority: 'متوسطة',
                category: 'إدارة الأطباء',
                title: 'تحسين أداء الفريق',
                description: `الطبيب ${doctorPerformance[0][0]} يحقق أفضل إيرادات - يمكن الاستفادة من خبرته`,
                action: 'إنشاء برنامج تدريبي قائم على التجربة'
            });
        }
        
        return recommendations;
    }

    // توليد التوقعات
    generateForecasts(report) {
        const forecasts = {
            nextMonth: this.forecastNextMonth(report),
            quarterly: this.forecastQuarterly(report),
            yearly: this.forecastYearly(report)
        };
        
        return forecasts;
    }

    // توقعات الشهر القادم
    forecastNextMonth(report) {
        // استخدام متوسط النمو في آخر 3 شهور
        const lastThreeMonths = this.getLastThreeMonths(report.year, report.month);
        const avgGrowthRate = this.calculateAverageGrowthRate(lastThreeMonths);
        
        const forecast = {
            revenue: Math.round(report.revenue.total * (1 + avgGrowthRate / 100)),
            patients: Math.round(report.revenue.count * (1 + avgGrowthRate / 100)),
            growthRate: avgGrowthRate,
            confidence: 'متوسط'
        };
        
        return forecast;
    }

    // توقعات ربع سنوية
    forecastQuarterly(report) {
        const avgMonthlyGrowth = this.calculateAverageGrowthRate(this.getLastSixMonths(report.year, report.month));
        
        const forecast = {
            revenue: Math.round(report.revenue.total * 3 * (1 + avgMonthlyGrowth / 100)),
            patients: Math.round(report.revenue.count * 3 * (1 + avgMonthlyGrowth / 100)),
            avgMonthly: Math.round(report.revenue.total * (1 + avgMonthlyGrowth / 100)),
            growthRate: avgMonthlyGrowth
        };
        
        return forecast;
    }

    // توقعات سنوية
    forecastYearly(report) {
        const avgGrowth = this.calculateAverageGrowthRate(this.getLastTwelveMonths(report.year, report.month));
        
        const forecast = {
            revenue: Math.round(report.revenue.total * 12 * (1 + avgGrowth / 100)),
            patients: Math.round(report.revenue.count * 12 * (1 + avgGrowth / 100)),
            monthlyAvg: Math.round(report.revenue.total * (1 + avgGrowth / 100)),
            growthRate: avgGrowth
        };
        
        return forecast;
    }

    // الحصول على آخر 3 شهور
    getLastThreeMonths(year, month) {
        const months = [];
        let currentYear = year;
        let currentMonth = month;
        
        for (let i = 0; i < 3; i++) {
            if (currentMonth === 0) {
                currentMonth = 12;
                currentYear--;
            }
            
            const report = this.accounting.getMonthlyReport(currentMonth, currentYear);
            if (report.revenue.total > 0) {
                months.push(report);
            }
            
            currentMonth--;
        }
        
        return months;
    }

    // الحصول على آخر 6 شهور
    getLastSixMonths(year, month) {
        const months = [];
        let currentYear = year;
        let currentMonth = month;
        
        for (let i = 0; i < 6; i++) {
            if (currentMonth === 0) {
                currentMonth = 12;
                currentYear--;
            }
            
            const report = this.accounting.getMonthlyReport(currentMonth, currentYear);
            if (report.revenue.total > 0) {
                months.push(report);
            }
            
            currentMonth--;
        }
        
        return months;
    }

    // الحصول على آخر 12 شهر
    getLastTwelveMonths(year, month) {
        const months = [];
        let currentYear = year;
        let currentMonth = month;
        
        for (let i = 0; i < 12; i++) {
            if (currentMonth === 0) {
                currentMonth = 12;
                currentYear--;
            }
            
            const report = this.accounting.getMonthlyReport(currentMonth, currentYear);
            if (report.revenue.total > 0) {
                months.push(report);
            }
            
            currentMonth--;
        }
        
        return months;
    }

    // حساب متوسط معدل النمو
    calculateAverageGrowthRate(months) {
        if (months.length < 2) return 0;
        
        const growthRates = [];
        
        for (let i = 1; i < months.length; i++) {
            const current = months[i];
            const previous = months[i - 1];
            
            if (previous.revenue.total > 0) {
                const growthRate = this.calculatePercentageChange(current.revenue.total, previous.revenue.total);
                growthRates.push(parseFloat(growthRate));
            }
        }
        
        if (growthRates.length === 0) return 0;
        
        return growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    }

    // تصدير تقرير كملف JSON
    exportReportToJSON(report) {
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `تقرير-عيادة-العامر-${report.period}.json`;
        link.click();
    }

    // تصدير تقرير كملف CSV
    exportReportToCSV(report) {
        let csv = 'نوع الخدمة,عدد المرضى,إجمالي الإيرادات,متوسط السعر\n';
        
        Object.entries(report.revenue.byService).forEach(([service, stats]) => {
            csv += `${service},${stats.totalPatients},${stats.totalAmount},${Math.round(stats.averagePrice)}\n`;
        });
        
        const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `خدمات-عيادة-العامر-${report.period}.csv`;
        link.click();
    }
}

// إنشاء مثيل عام من نظام التقارير
const reportsSystem = new ReportsSystem();