// ==============================
// الأسئلة والإجابات المخزنة في السكربت
// ==============================

const questionsData = [
    {
        id: 1,
        question: "هل تأكل التفاح؟",
        answer: "نعم، التفاح مفيد للصحة ويحتوي على فيتامينات وألياف."
    },
    {
        id: 2,
        question: "ما هي عاصمة فرنسا؟",
        answer: "باريس هي عاصمة فرنسا."
    },
    {
        id: 3,
        question: "كم عدد أيام الأسبوع؟",
        answer: "7 أيام: السبت، الأحد، الإثنين، الثلاثاء، الأربعاء، الخميس، الجمعة."
    },
    {
        id: 4,
        question: "ما هو لون السماء في يوم صافٍ؟",
        answer: "اللون الأزرق بسبب تشتت الضوء في الغلاف الجوي."
    },
    {
        id: 5,
        question: "من الذي اخترع المصباح الكهربائي؟",
        answer: "توماس إديسون اخترع المصباح الكهربائي المتوهج."
    },
    {
        id: 6,
        question: "ما هي أكبر قارة في العالم؟",
        answer: "قارة آسيا هي أكبر القارات مساحة."
    },
    {
        id: 7,
        question: "كم عدد كواكب المجموعة الشمسية؟",
        answer: "8 كواكب: عطارد، الزهرة، الأرض، المريخ، المشتري، زحل، أورانوس، نبتون."
    },
    {
        id: 8,
        question: "ما هي اللغة الرسمية في الصين؟",
        answer: "اللغة الصينية المندرينية هي اللغة الرسمية."
    },
    {
        id: 9,
        question: "من هو مؤلف كتاب 'شعب الله'؟",
        answer: "جلال الدين الرومي."
    },
    {
        id: 10,
        question: "ما هو أسرع حيوان بري؟",
        answer: "الفهد الصياد هو أسرع حيوان بري."
    }
];

// ==============================
// معلومات تسجيل الدخول للمسؤول
// ==============================

// كلمة المرور الافتراضية: يمكنك تغييرها هنا
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"  // غير هذه الكلمة إلى ما تريد
};

// ==============================
// إدارة حالة التطبيق
// ==============================

class QuestionApp {
    constructor() {
        this.isAdmin = false;
        this.showAnswers = false;
        this.init();
    }

    init() {
        // التحقق من تسجيل الدخول السابق
        this.checkLoginStatus();
        
        // تهيئة الأحداث
        this.initEvents();
        
        // عرض الأسئلة
        this.renderQuestions();
    }

    // التحقق من حالة تسجيل الدخول
    checkLoginStatus() {
        const savedLogin = localStorage.getItem('isAdminLoggedIn');
        if (savedLogin === 'true') {
            this.isAdmin = true;
            this.showAdminControls();
        }
    }

    // عرض واجهة المسؤول
    showAdminControls() {
        document.getElementById('adminControls').style.display = 'flex';
        document.getElementById('loginToggleBtn').style.display = 'none';
        document.getElementById('answersStatus').innerHTML = '<i class="fas fa-eye"></i> الإجابات ظاهرة للمسؤول';
        document.getElementById('answersStatus').style.backgroundColor = '#d4edda';
        document.getElementById('answersStatus').style.borderColor = '#c3e6cb';
    }

    // إخفاء واجهة المسؤول
    hideAdminControls() {
        document.getElementById('adminControls').style.display = 'none';
        document.getElementById('loginToggleBtn').style.display = 'flex';
        this.showAnswers = false;
        document.getElementById('answersStatus').innerHTML = '<i class="fas fa-eye-slash"></i> الإجابات مخفية';
        document.getElementById('answersStatus').style.backgroundColor = '#fff3cd';
        document.getElementById('answersStatus').style.borderColor = '#ffeaa7';
    }

    // تسجيل الدخول
    login(username, password) {
        if (username === ADMIN_CREDENTIALS.username && 
            password === ADMIN_CREDENTIALS.password) {
            
            this.isAdmin = true;
            localStorage.setItem('isAdminLoggedIn', 'true');
            this.showAdminControls();
            this.hideLoginModal();
            return true;
        }
        return false;
    }

    // تسجيل الخروج
    logout() {
        this.isAdmin = false;
        this.showAnswers = false;
        localStorage.removeItem('isAdminLoggedIn');
        this.hideAdminControls();
        this.renderQuestions(); // إعادة عرض الأسئلة بدون إجابات
    }

    // عرض نافذة تسجيل الدخول
    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
        document.getElementById('username').focus();
    }

    // إخفاء نافذة تسجيل الدخول
    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginError').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    // عرض الأسئلة
    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';

        document.getElementById('questionsCount').textContent = questionsData.length;

        questionsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.dataset.id = item.id;

            // عرض الإجابة أو إخفاؤها
            let answerHtml = '';
            if (this.isAdmin && this.showAnswers) {
                answerHtml = `
                    <div class="answer-section">
                        <div class="answer-visible">
                            <h4><i class="fas fa-check-circle"></i> الإجابة:</h4>
                            <p>${item.answer}</p>
                            <small style="color: #155724; display: block; margin-top: 10px;">
                                <i class="fas fa-info-circle"></i> هذه الإجابة مرئية فقط لأنك مسؤول
                            </small>
                        </div>
                    </div>
                `;
            } else {
                answerHtml = `
                    <div class="answer-section">
                        <div class="answer-hidden">
                            <i class="fas fa-lock"></i>
                            <p>الإجابة مخفية - للمسؤول فقط</p>
                            <small>سجل الدخول كمسؤول لرؤية الإجابة</small>
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="question-header">
                    <div class="question-number">${item.id}</div>
                    <div class="question-text">${item.question}</div>
                    <div class="question-actions">
                        ${this.isAdmin ? `
                            <button class="btn btn-sm btn-primary edit-question" data-id="${item.id}">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                        ` : ''}
                    </div>
                </div>
                ${answerHtml}
            `;

            container.appendChild(card);
        });

        // إضافة أحداث لأزرار التعديل (إذا كان مسؤولاً)
        if (this.isAdmin) {
            document.querySelectorAll('.edit-question').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.edit-question').dataset.id);
                    this.editQuestion(id);
                });
            });
        }
    }

    // تعديل سؤال (وهمي - للتطوير المستقبلي)
    editQuestion(id) {
        const question = questionsData.find(q => q.id === id);
        if (question) {
            alert(`تعديل السؤال ${id}:\n\nالسؤال: ${question.question}\nالإجابة: ${question.answer}\n\nملاحظة: لتعديل السؤال بشكل دائم، افتح ملف script.js وعدل المصفوفة questionsData مباشرة.`);
        }
    }

    // عرض الإجابات للمسؤول
    showAllAnswers() {
        if (this.isAdmin) {
            this.showAnswers = true;
            this.renderQuestions();
        }
    }

    // إخفاء الإجابات
    hideAllAnswers() {
        this.showAnswers = false;
        this.renderQuestions();
    }

    // تهيئة الأحداث
    initEvents() {
        // زر تسجيل الدخول
        document.getElementById('loginToggleBtn').addEventListener('click', () => {
            this.showLoginModal();
        });

        // زر تسجيل الخروج
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // زر عرض الإجابات
        document.getElementById('showAnswersBtn').addEventListener('click', () => {
            this.showAllAnswers();
        });

        // زر إخفاء الإجابات
        document.getElementById('hideAnswersBtn').addEventListener('click', () => {
            this.hideAllAnswers();
        });

        // إغلاق نافذة التسجيل
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.hideLoginModal();
        });

        // إغلاق النافذة عند النقر خارجها
        window.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.hideLoginModal();
            }
        });

        // تسجيل الدخول
        document.getElementById('loginBtn').addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorElement = document.getElementById('loginError');

            if (!username || !password) {
                errorElement.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
                errorElement.style.display = 'block';
                return;
            }

            if (this.login(username, password)) {
                errorElement.style.display = 'none';
                this.renderQuestions();
            } else {
                errorElement.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                errorElement.style.display = 'block';
            }
        });

        // السماح بالدخول بالزر Enter
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('loginBtn').click();
            }
        });
    }
}

// ==============================
// بدء التطبيق عند تحميل الصفحة
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    // إظهار معلومات كلمة المرور في الكونسول لمساعدة المطور
    console.log('معلومات تسجيل الدخول للمسؤول:');
    console.log('اسم المستخدم:', ADMIN_CREDENTIALS.username);
    console.log('كلمة المرور:', ADMIN_CREDENTIALS.password);
    console.log('لتغيير كلمة المرور، عدل السطر 78 في ملف script.js');
    
    // بدء التطبيق
    const app = new QuestionApp();
    
    // زر لإظهار/إخفاء كلمة المرور (للمسؤولين)
    const togglePasswordBtn = document.createElement('button');
    togglePasswordBtn.textContent = 'إظهار/إخفاء كلمة المرور';
    togglePasswordBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--admin-color);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Noto Sans Arabic', sans-serif;
        z-index: 1000;
        display: none;
    `;
    document.body.appendChild(togglePasswordBtn);
    
    // إظهار زر كلمة المرور فقط في حالات التطوير
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        togglePasswordBtn.style.display = 'block';
        togglePasswordBtn.addEventListener('click', () => {
            const passwordField = document.getElementById('password');
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                togglePasswordBtn.textContent = 'إخفاء كلمة المرور';
            } else {
                passwordField.type = 'password';
                togglePasswordBtn.textContent = 'إظهار كلمة المرور';
            }
        });
    }
});