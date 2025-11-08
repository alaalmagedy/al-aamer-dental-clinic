/**
 * تطبيق عيادة العامر للأسنان - JavaScript
 * نظام شامل لإدارة مواعيد عيادات الأسنان مع ميزات متقدمة
 */

// متغيرات عامة
let appointments = [];
let selectedTime = '';
let currentEditId = null;
let selectedPaymentMethod = null;

// بيانات الأطباء والخدمات المحدثة لعيادة العامر
const doctorsData = {
    'dr-aamer': { 
        name: 'د. أحمد العامر', 
        specialty: 'أخصائي تقويم الأسنان',
        phone: '+967 123 456 789',
        workingHours: { start: '08:00', end: '18:00' },
        experience: '15 سنة',
        image: 'dr-aamer.jpg'
    },
    'dr-fatima': { 
        name: 'د. فاطمة العيادي', 
        specialty: 'أخصائية جراحة الفم',
        phone: '+967 123 456 790',
        workingHours: { start: '10:00', end: '19:00' },
        experience: '12 سنة',
        image: 'dr-fatima.jpg'
    },
    'dr-mohammed': { 
        name: 'د. محمد العبيدي', 
        specialty: 'أخصائي علاج الجذور',
        phone: '+967 123 456 791',
        workingHours: { start: '08:30', end: '17:30' },
        experience: '10 سنوات',
        image: 'dr-mohammed.jpg'
    }
};

const servicesData = {
    'examination': { 
        name: 'فحص شامل + استشارة', 
        duration: 30, 
        price: 50,
        description: 'فحص شامل للأسنان مع خطة علاجية'
    },
    'cleaning': { 
        name: 'تنظيف الأسنان الاحترافي', 
        duration: 45, 
        price: 75,
        description: 'تنظيف عميق وإزالة الجير والترسبات'
    },
    'filling': { 
        name: 'حشو الأسنان (بيضاء/فضية)', 
        duration: 60, 
        price: 100,
        description: 'حشو الأسنان بمواد عالية الجودة'
    },
    'extraction': { 
        name: 'خلع الأسنان البسيط/المعقد', 
        duration: 30, 
        price: 80,
        description: 'خلع آمن ومريح تحت التخدير الموضعي'
    },
    'orthodontics': { 
        name: 'تقويم الأسنان الشفاف', 
        duration: 90, 
        price: 200,
        description: 'تقويم شفاف وجميل للثقة بالنفس'
    },
    'root-canal': { 
        name: 'علاج الجذور بالميكروسكوب', 
        duration: 90, 
        price: 150,
        description: 'علاج الجذور بتقنية ميكروسكوب متطورة'
    },
    'whitening': { 
        name: 'تبييض الأسنان بالليزر', 
        duration: 60, 
        price: 120,
        description: 'تبييض سريع وآمن بتقنية الليزر'
    },
    'implants': { 
        name: 'زراعة الأسنان', 
        duration: 120, 
        price: 300,
        description: 'زراعة أسنان دائمة وجودة عالية'
    },
    'crowns': { 
        name: 'تركيب التيجان (Porcelain)', 
        duration: 90, 
        price: 250,
        description: 'تيجان خزفية متقنة وجميلة المظهر'
    }
};

// إعدادات العيادة
const clinicSettings = {
    name: 'عيادة العامر للأسنان',
    address: 'خور مكسر، عدن، اليمن',
    phone: '+967 123 456 789',
    email: 'info@al-aamer-dental.com',
    workingDays: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
    workingHours: { start: '08:00', end: '20:00' },
    emergencyContact: '+967 123 456 789',
    priceRange: '$50 - $300',
    services: Object.keys(servicesData).length
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('عيادة العامر للأسنان - تم التهيئة');
    
    // تحديد تاريخ اليوم كحد أدنى
    const today = new Date().toISOString().split('T')[0];
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput) {
        appointmentDateInput.min = today;
        appointmentDateInput.value = today;
    }
    
    // تحميل المواعيد
    loadAppointments();
    
    // تحديث لوحة تحكم العيادة
    updateClinicDashboard();
    
    // إضافة مستمعي الأحداث
    addEventListeners();
    
    // إنشاء فترات الوقت الافتراضية
    generateTimeSlots();
    
    // إضافة أنيميشن للتحميل
    addScrollAnimations();
    
    // تهيئة نظام التذكيرات
    initializeReminderSystem();
    
    // تهيئة نظام الدفع
    initializePaymentSystem();
    
    console.log('التطبيق جاهز للاستخدام - عيادة العامر');
}

function addEventListeners() {
    // معالجة تغيير التاريخ
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            generateTimeSlots();
            validateDate();
        });
    }
    
    // معالجة تغيير الطبيب
    const doctorSelect = document.getElementById('doctor');
    if (doctorSelect) {
        doctorSelect.addEventListener('change', function() {
            generateTimeSlots();
            updateDoctorInfo();
        });
    }
    
    // معالجة تغيير الخدمة
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            updateServiceInfo();
            generateTimeSlots();
            updatePrice();
        });
    }
    
    // معالجة إرسال النموذج
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // إضافة مستمعي أحداث للتبويبات
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function() {
            refreshAppointments();
        });
    });
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر
    document.querySelectorAll('.card, .stat-card, .appointment-card').forEach(el => {
        observer.observe(el);
    });
}

// نظام التذكيرات
function initializeReminderSystem() {
    // إنشاء تذكيرات للعيادة
    scheduleReminders();
}

function scheduleReminders() {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 ساعة قبل الموعد
    
    if (reminderTime < now) return; // لا تقم بجدولة تذكيرات ماضية
    
    // جدولة تذكيرات للمرضى
    appointments.forEach(appointment => {
        if (appointment.reminder) {
            const appointmentTime = new Date(`${appointment.date} ${appointment.time}`);
            const reminder24h = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
            const reminder2h = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
            
            if (reminder24h > now) {
                setTimeout(() => {
                    sendReminder(appointment, '24h');
                }, reminder24h - now);
            }
            
            if (reminder2h > now) {
                setTimeout(() => {
                    sendReminder(appointment, '2h');
                }, reminder2h - now);
            }
        }
    });
}

function sendReminder(appointment, type) {
    const doctor = doctorsData[appointment.doctor];
    const service = servicesData[appointment.service];
    
    let message = '';
    if (type === '24h') {
        message = `تذكير: لديك موعد بعد 24 ساعة مع ${doctor.name} للخدمة: ${service.name}`;
    } else if (type === '2h') {
        message = `تذكير: موعدك مع ${doctor.name} بعد ساعتين!`;
    }
    
    // إرسال التذكير حسب الإعدادات
    if (appointment.smsReminder && appointment.patientPhone) {
        console.log(`إرسال SMS: ${message}`);
        // هنا يمكن إضافة خدمة SMS حقيقية
    }
    
    if (appointment.whatsappReminder && appointment.patientPhone) {
        const whatsappNumber = appointment.patientPhone.replace(/\+/g, '').replace(/0/g, '967');
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    if (appointment.emailReminder && appointment.patientEmail) {
        console.log(`إرسال إيميل: ${message}`);
        // هنا يمكن إضافة خدمة إيميل حقيقية
    }
}

// نظام الدفع
function initializePaymentSystem() {
    // تهيئة خيارات الدفع
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            selectPaymentMethod(methodType);
        });
    });
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // إزالة التحديد من جميع الطرق
    document.querySelectorAll('.payment-method .card').forEach(card => {
        card.classList.remove('border-primary', 'border-3');
    });
    
    // إضافة التحديد للطريقة المختارة
    event.currentTarget.querySelector('.card').classList.add('border-primary', 'border-3');
    
    // عرض تفاصيل الدفع
    showPaymentDetails(method);
}

function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    const paymentContent = document.getElementById('paymentContent');
    let content = '';
    
    switch(method) {
        case 'cash':
            content = `
                <div class="alert alert-success">
                    <h6><i class="fas fa-money-bill-wave"></i> الدفع عند الوصول</h6>
                    <p class="mb-2">قم بالدفع نقداً في العيادة عند حضور الموعد</p>
                    <ul class="mb-0">
                        <li>مكافأة خصم 5%</li>
                        <li>استلام إيصال ورقي</li>
                        <li>دفع جزئي متاح</li>
                    </ul>
                </div>
            `;
            break;
            
        case 'transfer':
            content = `
                <div class="alert alert-info">
                    <h6><i class="fas fa-university"></i> الحوالة البنكية</h6>
                    <p class="mb-2">قم بتحويل المبلغ إلى حساب العيادة</p>
                    <ul class="mb-0">
                        <li><strong>البنك:</strong> بنك اليمن الدولي</li>
                        <li><strong>رقم الحساب:</strong> 123-456-789</li>
                        <li><strong>الاسم:</strong> عيادة العامر للأسنان</li>
                        <li><strong>IBAN:</strong> YE-123456789</li>
                    </ul>
                </div>
            `;
            break;
            
        case 'mobile':
            content = `
                <div class="alert alert-warning">
                    <h6><i class="fas fa-mobile-alt"></i> الدفع الإلكتروني</h6>
                    <p class="mb-2">ادفع باستخدام بطاقتك الائتمانية أو مدى</p>
                    <ul class="mb-0">
                        <li>بطاقات ائتمان (Visa, MasterCard)</li>
                        <li>مدى (الدفع المحلي)</li>
                        <li>Apple Pay, Google Pay</li>
                        <li>مضمون وآمن 100%</li>
                    </ul>
                </div>
            `;
            break;
    }
    
    paymentContent.innerHTML = content;
    paymentDetails.style.display = 'block';
}

// دوال عرض المعلومات
function updateDoctorInfo() {
    const doctorSelect = document.getElementById('doctor');
    const selectedDoctor = doctorSelect.value;
    
    if (selectedDoctor && doctorsData[selectedDoctor]) {
        const doctor = doctorsData[selectedDoctor];
        console.log(`تم اختيار الطبيب: ${doctor.name} - ${doctor.specialty}`);
    }
}

function updateServiceInfo() {
    const serviceSelect = document.getElementById('service');
    const selectedService = serviceSelect.value;
    
    if (selectedService && servicesData[selectedService]) {
        const service = servicesData[selectedService];
        console.log(`تم اختيار الخدمة: ${service.name} - ${service.price}$`);
    }
}

function updatePrice() {
    const serviceSelect = document.getElementById('service');
    const selectedService = serviceSelect.value;
    
    if (selectedService && servicesData[selectedService]) {
        const service = servicesData[selectedService];
        // يمكن عرض السعر في مكان مناسب
        console.log(`السعر: ${service.price}$ لمدة ${service.duration} دقيقة`);
    }
}

// إنشاء فترات الوقت
function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    const selectedDate = document.getElementById('appointmentDate').value;
    const selectedDoctor = document.getElementById('doctor').value;
    
    // التأكد من أن التاريخ والطبيب محددان
    if (!selectedDate || !selectedDoctor) {
        if (!selectedDate) {
            showAlert('يرجى اختيار التاريخ أولاً', 'info');
        }
        if (!selectedDoctor) {
            showAlert('يرجى اختيار الطبيب أولاً', 'info');
        }
        return;
    }
    
    // التحقق من صحة التاريخ
    if (!validateDate()) {
        return;
    }
    
    // فترات العمل الموسعة
    const workingHours = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30'
    ];
    
    // إنشاء أزرار الأوقات
    workingHours.forEach(time => {
        const timeSlotElement = createTimeSlotElement(time);
        timeSlotsContainer.appendChild(timeSlotElement);
    });
}

function createTimeSlotElement(time) {
    const timeSlotDiv = document.createElement('div');
    timeSlotDiv.className = 'time-slot';
    timeSlotDiv.textContent = time;
    timeSlotDiv.onclick = () => selectTimeSlot(time, timeSlotDiv);
    
    // التحقق من توافر الوقت
    if (!isTimeAvailable(time)) {
        timeSlotDiv.classList.add('unavailable');
        timeSlotDiv.style.pointerEvents = 'none';
    }
    
    return timeSlotDiv;
}

function selectTimeSlot(time, element) {
    // إزالة التحديد من جميع الأوقات
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // تحديد الوقت المختار
    element.classList.add('selected');
    selectedTime = time;
    
    console.log(`تم اختيار الوقت: ${time}`);
}

function isTimeAvailable(time) {
    const selectedDate = document.getElementById('appointmentDate').value;
    
    // التحقق من المواعيد المحجوزة
    const existingAppointment = appointments.find(apt => 
        apt.date === selectedDate && apt.time === time
    );
    
    return !existingAppointment;
}

// التحقق من صحة التاريخ
function validateDate() {
    const selectedDate = document.getElementById('appointmentDate').value;
    
    if (!selectedDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(selectedDate);
    
    if (appointmentDate < today) {
        showAlert('لا يمكن حجز موعد في تاريخ ماضي', 'warning');
        return false;
    }
    
    // التحقق من أيام العمل (يمكن تخصيصها)
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0) { // الأحد
        showAlert('العيادة مغلقة يوم الأحد', 'warning');
        return false;
    }
    
    return true;
}

// معالجة إرسال النموذج
function handleFormSubmit(e) {
    e.preventDefault();
    
    // التحقق من وجود الوقت المحدد
    if (!selectedTime) {
        showAlert('يرجى اختيار وقت الموعد', 'warning');
        return;
    }
    
    // التحقق من اختيار طريقة الدفع
    if (!selectedPaymentMethod) {
        showAlert('يرجى اختيار طريقة الدفع', 'warning');
        return;
    }
    
    // التحقق من صحة جميع الحقول
    if (!validateForm()) {
        return;
    }
    
    // جمع بيانات الموعد
    const appointmentData = collectAppointmentData();
    
    // حفظ الموعد
    saveAppointment(appointmentData);
    
    // عرض رسالة نجاح
    showPaymentConfirmation(appointmentData);
    
    // مسح النموذج
    resetForm();
}

function validateForm() {
    const requiredFields = ['doctor', 'service', 'appointmentDate', 'patientName', 'patientPhone'];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            showAlert(`يرجى ملء حقل ${getFieldLabel(field)}`, 'warning');
            element.focus();
            return false;
        }
    }
    
    // التحقق من رقم الهاتف
    const phone = document.getElementById('patientPhone').value;
    if (!/^[0-9+\-\s()]+$/.test(phone)) {
        showAlert('يرجى إدخال رقم هاتف صحيح', 'warning');
        document.getElementById('patientPhone').focus();
        return false;
    }
    
    return true;
}

function getFieldLabel(field) {
    const labels = {
        'doctor': 'الطبيب',
        'service': 'نوع الخدمة',
        'appointmentDate': 'التاريخ',
        'patientName': 'اسم المريض',
        'patientPhone': 'رقم الهاتف'
    };
    return labels[field] || field;
}

function collectAppointmentData() {
    return {
        id: generateAppointmentId(),
        doctor: document.getElementById('doctor').value,
        service: document.getElementById('service').value,
        date: document.getElementById('appointmentDate').value,
        time: selectedTime,
        paymentMethod: selectedPaymentMethod,
        patientName: document.getElementById('patientName').value.trim(),
        patientPhone: document.getElementById('patientPhone').value.trim(),
        patientEmail: document.getElementById('patientEmail').value.trim(),
        patientAge: document.getElementById('patientAge').value,
        notes: document.getElementById('notes').value.trim(),
        smsReminder: document.getElementById('smsReminder').checked,
        whatsappReminder: document.getElementById('whatsappReminder').checked,
        emailReminder: document.getElementById('emailReminder').checked,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

function generateAppointmentId() {
    return 'AL' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function saveAppointment(appointmentData) {
    appointments.push(appointmentData);
    saveAppointmentsToStorage();
    
    // إرسال إشعار للعيادة
    sendNotification(appointmentData);
    
    // جدولة التذكيرات
    if (appointmentData.smsReminder || appointmentData.whatsappReminder || appointmentData.emailReminder) {
        scheduleAppointmentReminders(appointmentData);
    }
}

// تحميل المواعيد
function loadAppointments() {
    try {
        const savedAppointments = localStorage.getItem('alAamerDentalAppointments');
        if (savedAppointments) {
            appointments = JSON.parse(savedAppointments);
        }
    } catch (error) {
        console.error('خطأ في تحميل المواعيد:', error);
    }
}

// حفظ المواعيد
function saveAppointmentsToStorage() {
    try {
        localStorage.setItem('alAamerDentalAppointments', JSON.stringify(appointments));
    } catch (error) {
        console.error('خطأ في حفظ المواعيد:', error);
        showAlert('حدث خطأ في حفظ الموعد', 'error');
    }
}

// إرسال إشعار
function sendNotification(appointmentData) {
    console.log('إشعار جديد:', appointmentData);
    
    // إشعار للعيادة
    const notification = {
        type: 'new_appointment',
        appointment: appointmentData,
        timestamp: new Date().toISOString()
    };
    
    // إشعار للمريض
    const patientNotification = {
        type: 'appointment_confirmed',
        appointment: appointmentData,
        message: `تم حجز موعدك مع ${doctorsData[appointmentData.doctor].name} في ${appointmentData.date} الساعة ${appointmentData.time}`
    };
    
    console.log('إشعارات:', { notification, patientNotification });
}

// جدولة تذكيرات الموعد
function scheduleAppointmentReminders(appointment) {
    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    
    // تذكير 24 ساعة قبل
    const reminder24h = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > now) {
        setTimeout(() => {
            sendReminder(appointment, '24h');
        }, reminder24h - now);
    }
    
    // تذكير ساعتين قبل
    const reminder2h = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);
    if (reminder2h > now) {
        setTimeout(() => {
            sendReminder(appointment, '2h');
        }, reminder2h - now);
    }
}

// عرض تأكيد الدفع
function showPaymentConfirmation(appointmentData) {
    const doctor = doctorsData[appointmentData.doctor];
    const service = servicesData[appointmentData.service];
    
    let paymentInfo = '';
    switch(appointmentData.paymentMethod) {
        case 'cash':
            paymentInfo = 'ادفع نقداً في العيادة مع مكافأة خصم 5%';
            break;
        case 'transfer':
            paymentInfo = `قم بتحويل المبلغ ${service.price}$ إلى حساب العيادة`;
            break;
        case 'mobile':
            paymentInfo = `ادفع إلكترونياً ${service.price}$ باستخدام بطاقتك`;
            break;
    }
    
    const confirmationMessage = `
        تم حجز موعدك بنجاح! 🎉
        
        التفاصيل:
        • الطبيب: ${doctor.name}
        • الخدمة: ${service.name}
        • التاريخ: ${appointmentData.date}
        • الوقت: ${appointmentData.time}
        • السعر: ${service.price}$
        
        ${paymentInfo}
        
        رقم الحجز: ${appointmentData.id}
        
        ستصلك رسالة تأكيد على: ${appointmentData.patientPhone}
        
        للمزيد من المعلومات: ${clinicSettings.phone}
    `;
    
    alert(confirmationMessage);
}

// إعادة تعيين النموذج
function resetForm() {
    document.getElementById('appointmentForm').reset();
    selectedTime = '';
    selectedPaymentMethod = null;
    
    // إزالة التحديد من الأوقات
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // إخفاء تفاصيل الدفع
    document.getElementById('paymentDetails').style.display = 'none';
    
    // إعادة تعيين تاريخ اليوم
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').value = today;
    
    console.log('تم إعادة تعيين النموذج');
}

// عرض التنبيهات
function showAlert(message, type = 'info') {
    // إنشاء عنصر التنبيه
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // إضافة التنبيه للصفحة
    document.body.appendChild(alertDiv);
    
    // إزالة التنبيه بعد 5 ثواني
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// تحديث لوحة تحكم العيادة
function updateClinicDashboard() {
    // إجمالي المرضى
    const uniquePatients = new Set(appointments.map(apt => apt.patientPhone));
    document.getElementById('totalPatients').textContent = uniquePatients.size;
    document.getElementById('totalPatientsStat').textContent = uniquePatients.size;
    
    // مواعيد اليوم
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    document.getElementById('todayAppointments').textContent = todayAppointments.length;
    document.getElementById('todayAppointmentsStat').textContent = todayAppointments.length;
    
    // إيرادات الشهر
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => {
        return sum + (servicesData[apt.service]?.price || 0);
    }, 0);
    
    document.getElementById('monthlyRevenue').textContent = monthlyRevenue + '$';
    document.getElementById('monthlyRevenueStat').textContent = monthlyRevenue + '$';
    
    // معدل الحضور
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const attendanceRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    
    document.getElementById('attendanceRate').textContent = attendanceRate + '%';
    document.getElementById('retentionRateStat').textContent = attendanceRate + '%';
}

// دوال إضافية
function refreshAppointments() {
    loadAppointments();
    updateClinicDashboard();
    displayAppointments();
    console.log('تم تحديث المواعيد');
}

function displayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = appointments.filter(apt => apt.date >= today);
    const past = appointments.filter(apt => apt.date < today);
    
    displayAppointmentList('upcomingAppointments', upcoming, 'upcoming');
    displayAppointmentList('pastAppointments', past, 'past');
}

function displayAppointmentList(containerId, appointments, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-calendar-times fa-3x mb-3"></i>
                <p>لا توجد مواعيد ${type === 'upcoming' ? 'قادمة' : 'سابقة'}</p>
            </div>
        `;
        return;
    }
    
    appointments.forEach(appointment => {
        const appointmentElement = createAppointmentElement(appointment);
        container.appendChild(appointmentElement);
    });
}

function createAppointmentElement(appointment) {
    const doctor = doctorsData[appointment.doctor];
    const service = servicesData[appointment.service];
    
    const div = document.createElement('div');
    div.className = 'appointment-card';
    div.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-8">
                <h6 class="mb-1">${service.name}</h6>
                <p class="text-muted mb-1">مع ${doctor.name}</p>
                <small class="text-muted">
                    <i class="fas fa-calendar"></i> ${appointment.date}
                    <i class="fas fa-clock ms-2"></i> ${appointment.time}
                    <i class="fas fa-user ms-2"></i> ${appointment.patientName}
                </small>
            </div>
            <div class="col-md-4 text-end">
                <span class="status ${appointment.status}">${getStatusText(appointment.status)}</span>
                <p class="mb-0 mt-2"><strong>${service.price}$</strong></p>
            </div>
        </div>
    `;
    
    return div;
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'في الانتظار',
        'confirmed': 'مؤكد',
        'completed': 'منجز',
        'cancelled': 'ملغي'
    };
    return statusTexts[status] || status;
}

// دوال إضافية
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function exportData(format = 'csv') {
    try {
        if (format === 'csv') {
            const csvContent = convertToCSV(appointments);
            downloadFile(csvContent, 'appointments.csv', 'text/csv');
            showAlert('تم تصدير البيانات بنجاح', 'success');
        }
    } catch (error) {
        console.error('خطأ في التصدير:', error);
        showAlert('حدث خطأ في تصدير البيانات', 'error');
    }
}

function convertToCSV(appointments) {
    const headers = ['ID', 'التاريخ', 'الوقت', 'الطبيب', 'الخدمة', 'المريض', 'الهاتف', 'الحالة', 'السعر'];
    const rows = appointments.map(apt => [
        apt.id,
        apt.date,
        apt.time,
        doctorsData[apt.doctor]?.name || apt.doctor,
        servicesData[apt.service]?.name || apt.service,
        apt.patientName,
        apt.patientPhone,
        getStatusText(apt.status),
        servicesData[apt.service]?.price || 0
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function createBackup() {
    try {
        const backup = {
            appointments: appointments,
            settings: clinicSettings,
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        };
        
        const backupContent = JSON.stringify(backup, null, 2);
        const backupName = `al-aamer-backup-${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(backupContent, backupName, 'application/json');
        
        showAlert('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
        showAlert('حدث خطأ في إنشاء النسخة الاحتياطية', 'error');
    }
}

// تصدير الدوال العامة
window.alAamerDental = {
    doctorsData,
    servicesData,
    clinicSettings,
    appointments,
    selectedTime,
    selectedPaymentMethod
};

console.log('تم تحميل تطبيق عيادة العامر للأسنان بنجاح');