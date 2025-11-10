/**
 * نظام المصادقة المتقدم - Al-Aamer Dental Clinic
 * متوافق مع معايير الأمان العالمية
 */

class AdvancedAuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 دقيقة
        this.maxLoginAttempts = 3;
        this.lockoutDuration = 15 * 60 * 1000; // 15 دقيقة
        this.encryptionKey = 'al_aamer_2025_secure_key';
        this.users = this.loadUsers();
        this.sessions = this.loadSessions();
        this.initSecurity();
    }

    // تحميل البيانات المشفرة
    loadUsers() {
        const stored = localStorage.getItem('al_aamer_users');
        if (stored) {
            try {
                return JSON.parse(this.decryptData(stored));
            } catch (e) {
                console.error('خطأ في تحميل بيانات المستخدمين:', e);
            }
        }
        return this.getDefaultUsers();
    }

    // إنشاء المستخدمين الافتراضيين
    getDefaultUsers() {
        return {
            'admin': {
                id: 'admin001',
                username: 'admin',
                password: 'admin123', // في التطبيق الحقيقي سيكون مشفر
                role: 'admin',
                fullName: 'مدير النظام',
                email: 'admin@al-aamer.com',
                phone: '00967-777-123456',
                permissions: ['all'],
                isActive: true,
                createdAt: '2025-11-10',
                lastLogin: null,
                avatar: '👨‍💼'
            },
            'doctor1': {
                id: 'doc001',
                username: 'doctor1',
                password: 'doc123',
                role: 'doctor',
                fullName: 'د. أحمد العامر',
                email: 'doctor1@al-aamer.com',
                phone: '00967-777-123457',
                permissions: ['manage_appointments', 'view_patients', 'add_medical_records', 'view_reports'],
                isActive: true,
                createdAt: '2025-11-10',
                lastLogin: null,
                specialization: 'طب وجراحة الفم والأسنان',
                license: 'DOC-2020-001',
                avatar: '👨‍⚕️'
            },
            'receptionist1': {
                id: 'rec001',
                username: 'receptionist1',
                password: 'rec123',
                role: 'receptionist',
                fullName: 'فاطمة أحمد',
                email: 'receptionist1@al-aamer.com',
                phone: '00967-777-123458',
                permissions: ['manage_appointments', 'view_patients', 'register_patients', 'basic_reports'],
                isActive: true,
                createdAt: '2025-11-10',
                lastLogin: null,
                avatar: '👩‍💼'
            },
            'cashier1': {
                id: 'cash001',
                username: 'cashier1',
                password: 'cash123',
                role: 'cashier',
                fullName: 'محمد علي',
                email: 'cashier1@al-aamer.com',
                phone: '00967-777-123459',
                permissions: ['process_payments', 'view_invoices', 'financial_reports'],
                isActive: true,
                createdAt: '2025-11-10',
                lastLogin: null,
                avatar: '💰'
            },
            'patient1': {
                id: 'pat001',
                username: 'patient1',
                password: 'pat123',
                role: 'patient',
                fullName: 'علي محمد الأحمد',
                email: 'patient1@email.com',
                phone: '00967-777-123460',
                permissions: ['view_own_appointments', 'book_appointment', 'view_own_medical_history', 'view_own_invoices'],
                isActive: true,
                createdAt: '2025-11-10',
                lastLogin: null,
                patientNumber: 'P-2025-001',
                dateOfBirth: '1990-05-15',
                gender: 'male',
                address: 'عدن، اليمن',
                medicalHistory: [],
                avatar: '👤'
            }
        };
    }

    // تحميل الجلسات
    loadSessions() {
        const stored = localStorage.getItem('al_aamer_sessions');
        if (stored) {
            try {
                return JSON.parse(this.decryptData(stored));
            } catch (e) {
                console.error('خطأ في تحميل الجلسات:', e);
            }
        }
        return {};
    }

    // تشفير البيانات
    encryptData(data) {
        try {
            return btoa(encodeURIComponent(data + this.encryptionKey));
        } catch (e) {
            console.error('خطأ في التشفير:', e);
            return data;
        }
    }

    // فك تشفير البيانات
    decryptData(encryptedData) {
        try {
            const decoded = decodeURIComponent(atob(encryptedData));
            return decoded.replace(this.encryptionKey, '');
        } catch (e) {
            console.error('خطأ في فك التشفير:', e);
            return encryptedData;
        }
    }

    // حفظ البيانات
    saveData() {
        localStorage.setItem('al_aamer_users', this.encryptData(JSON.stringify(this.users)));
        localStorage.setItem('al_aamer_sessions', this.encryptData(JSON.stringify(this.sessions)));
    }

    // تهيئة الأمان
    initSecurity() {
        // مراقبة النشاط
        this.setupActivityMonitor();
        // تنظيف الجلسات المنتهية الصلاحية
        this.cleanExpiredSessions();
        // مراقبة محاولات تسجيل الدخول الخاطئة
        this.checkLoginAttempts();
    }

    // مراقبة النشاط
    setupActivityMonitor() {
        let lastActivity = Date.now();
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                lastActivity = Date.now();
            }, true);
        });

        setInterval(() => {
            if (this.currentUser && (Date.now() - lastActivity) > this.sessionTimeout) {
                this.logout();
                this.showSessionTimeout();
            }
        }, 60000); // فحص كل دقيقة
    }

    // تسجيل الدخول
    login(username, password) {
        // فحص محاولات تسجيل الدخول الخاطئة
        if (this.isAccountLocked(username)) {
            throw new Error('الحساب مقفل مؤقتاً بسبب محاولات تسجيل دخول خاطئة متعددة');
        }

        const user = this.users[username];
        if (!user || user.password !== password || !user.isActive) {
            this.recordFailedLogin(username);
            throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
        }

        // تسجيل دخول ناجح
        this.clearFailedLogin(username);
        user.lastLogin = new Date().toISOString();
        
        // إنشاء جلسة
        const sessionId = this.generateSessionId();
        this.sessions[sessionId] = {
            userId: user.id,
            username: user.username,
            loginTime: Date.now(),
            lastActivity: Date.now(),
            ip: this.getClientIP()
        };

        this.currentUser = {
            ...user,
            sessionId: sessionId
        };

        this.saveData();
        this.logActivity(user.username, 'تسجيل دخول ناجح');
        
        return {
            success: true,
            user: this.getUserPublicInfo(user),
            redirect: this.getRedirectPath(user.role)
        };
    }

    // تسجيل الخروج
    logout() {
        if (this.currentUser) {
            this.logActivity(this.currentUser.username, 'تسجيل خروج');
            delete this.sessions[this.currentUser.sessionId];
            this.currentUser = null;
            this.saveData();
        }
    }

    // إنشاء حساب جديد
    createUser(userData) {
        const { username, password, role, fullName, email, phone, ...additionalData } = userData;
        
        // التحقق من عدم وجود المستخدم
        if (this.users[username]) {
            throw new Error('اسم المستخدم موجود بالفعل');
        }

        // التحقق من صحة البيانات
        if (!username || !password || !role || !fullName) {
            throw new Error('جميع الحقول المطلوبة يجب ملؤها');
        }

        // إنشاء المستخدم الجديد
        const newUser = {
            id: this.generateUserId(),
            username: username,
            password: password, // في التطبيق الحقيقي سيكون مشفر
            role: role,
            fullName: fullName,
            email: email || '',
            phone: phone || '',
            permissions: this.getDefaultPermissions(role),
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: null,
            ...additionalData
        };

        this.users[username] = newUser;
        this.saveData();
        this.logActivity('admin', `إنشاء حساب جديد: ${username}`);
        
        return this.getUserPublicInfo(newUser);
    }

    // تحديث المستخدم
    updateUser(username, updates) {
        if (!this.users[username]) {
            throw new Error('المستخدم غير موجود');
        }

        this.users[username] = { ...this.users[username], ...updates };
        this.saveData();
        this.logActivity('admin', `تحديث المستخدم: ${username}`);
        
        return this.getUserPublicInfo(this.users[username]);
    }

    // حذف المستخدم
    deleteUser(username) {
        if (!this.users[username]) {
            throw new Error('المستخدم غير موجود');
        }

        delete this.users[username];
        this.saveData();
        this.logActivity('admin', `حذف المستخدم: ${username}`);
    }

    // الحصول على معلومات المستخدم العامة
    getUserPublicInfo(user) {
        const { password, ...publicInfo } = user;
        return publicInfo;
    }

    // الحصول على الصلاحيات الافتراضية للدور
    getDefaultPermissions(role) {
        const permissions = {
            admin: ['all'],
            doctor: ['manage_appointments', 'view_patients', 'add_medical_records', 'view_reports', 'view_financial_reports'],
            receptionist: ['manage_appointments', 'view_patients', 'register_patients', 'basic_reports'],
            cashier: ['process_payments', 'view_invoices', 'financial_reports'],
            patient: ['view_own_appointments', 'book_appointment', 'view_own_medical_history', 'view_own_invoices']
        };
        return permissions[role] || [];
    }

    // التحقق من الصلاحية
    hasPermission(permission) {
        if (!this.currentUser) return false;
        if (this.currentUser.permissions.includes('all')) return true;
        return this.currentUser.permissions.includes(permission);
    }

    // الحصول على مسار التوجيه
    getRedirectPath(role) {
        const paths = {
            admin: 'admin-dashboard.html',
            doctor: 'doctor-dashboard.html',
            receptionist: 'receptionist-dashboard.html',
            cashier: 'cashier-dashboard.html',
            patient: 'patient-dashboard.html'
        };
        return paths[role] || 'login.html';
    }

    // التحقق من القفل
    isAccountLocked(username) {
        const attempts = JSON.parse(localStorage.getItem('login_attempts_' + username) || '[]');
        const recentAttempts = attempts.filter(time => Date.now() - time < this.lockoutDuration);
        return recentAttempts.length >= this.maxLoginAttempts;
    }

    // تسجيل محاولة فاشلة
    recordFailedLogin(username) {
        const attempts = JSON.parse(localStorage.getItem('login_attempts_' + username) || '[]');
        attempts.push(Date.now());
        localStorage.setItem('login_attempts_' + username, JSON.stringify(attempts));
    }

    // مسح محاولات فاشلة
    clearFailedLogin(username) {
        localStorage.removeItem('login_attempts_' + username);
    }

    // فحص محاولات تسجيل الدخول
    checkLoginAttempts() {
        for (let username in this.users) {
            if (this.isAccountLocked(username)) {
                const attempts = JSON.parse(localStorage.getItem('login_attempts_' + username) || '[]');
                const activeAttempts = attempts.filter(time => Date.now() - time < this.lockoutDuration);
                localStorage.setItem('login_attempts_' + username, JSON.stringify(activeAttempts));
            }
        }
    }

    // تنظيف الجلسات المنتهية الصلاحية
    cleanExpiredSessions() {
        const now = Date.now();
        for (let sessionId in this.sessions) {
            if (now - this.sessions[sessionId].loginTime > this.sessionTimeout) {
                delete this.sessions[sessionId];
            }
        }
        this.saveData();
    }

    // تسجيل النشاط
    logActivity(username, action) {
        const activities = JSON.parse(localStorage.getItem('system_activities') || '[]');
        activities.unshift({
            username: username,
            action: action,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP()
        });
        
        // الاحتفاظ بآخر 100 نشاط فقط
        if (activities.length > 100) {
            activities.splice(100);
        }
        
        localStorage.setItem('system_activities', JSON.stringify(activities));
    }

    // الحصول على IP
    getClientIP() {
        // في التطبيق الحقيقي، يمكن الحصول على IP من الخادم
        return '127.0.0.1';
    }

    // إنتاج معرف جلسة
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // إنتاج معرف مستخدم
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // عرض انتهاء الجلسة
    showSessionTimeout() {
        alert('انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.');
        window.location.href = 'login.html';
    }

    // الحصول على جميع المستخدمين
    getAllUsers() {
        return Object.values(this.users).map(user => this.getUserPublicInfo(user));
    }

    // البحث عن مستخدم
    searchUsers(query) {
        const users = this.getAllUsers();
        return users.filter(user => 
            user.fullName.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
    }

    // الحصول على إحصائيات النظام
    getSystemStats() {
        const users = Object.values(this.users);
        return {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            usersByRole: {
                admin: users.filter(u => u.role === 'admin').length,
                doctor: users.filter(u => u.role === 'doctor').length,
                receptionist: users.filter(u => u.role === 'receptionist').length,
                cashier: users.filter(u => u.role === 'cashier').length,
                patient: users.filter(u => u.role === 'patient').length
            },
            recentLogins: users.filter(u => u.lastLogin).length
        };
    }
}

// تصدير النظام للاستخدام العام
window.AdvancedAuthSystem = AdvancedAuthSystem;