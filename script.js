// ===========================================
// الأسئلة المخزنة في السكربت - يمكنك تعديلها هنا
// ===========================================

let questions = [
    { id: 1, text: "ما هو لون السماء في النهار؟" },
    { id: 2, text: "كم عدد أيام الأسبوع؟" },
    { id: 3, text: "ما هي عاصمة فرنسا؟" },
    { id: 4, text: "ما هو أكبر كوكب في المجموعة الشمسية؟" },
    { id: 5, text: "من الذي اخترع المصباح الكهربائي؟" },
    { id: 6, text: "ما هي اللغة الرسمية في الصين؟" },
    { id: 7, text: "كم عدد أركان الإسلام؟" },
    { id: 8, text: "ما هو أسرع حيوان بري؟" },
    { id: 9, text: "من هو مؤلف كتاب 'البخلاء'؟" },
    { id: 10, text: "ما هي أصغر وحدة في المادة؟" }
];

// ===========================================
// كلمة مرور المسؤول - غيرها كما تشاء
// ===========================================
const ADMIN_PASSWORD = "admin123";

// ===========================================
// المتغيرات العامة
// ===========================================
let userAnswers = {};
let isAdmin = false;
let captchaSolution = 0;

// ===========================================
// توليد كابتشا رياضية بسيطة
// ===========================================
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaSolution = num1 + num2;
    document.getElementById('captchaQuestion').innerHTML = 
        `${num1} + ${num2} = ?`;
}

// ===========================================
// عرض الأسئلة للمستخدم
// ===========================================
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        
        const savedAnswer = localStorage.getItem(`answer_${q.id}`) || '';
        
        questionDiv.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span class="question-number">${index + 1}</span>
                <h3 style="margin: 0; flex: 1;">${q.text}</h3>
            </div>
            <textarea 
                class="answer-input" 
                placeholder="اكتب إجابتك هنا..."
                rows="3"
                oninput="saveAnswer(${q.id}, this.value)"
            >${savedAnswer}</textarea>
            <div class="answer-status" id="status_${q.id}">
                ${savedAnswer ? 'تم حفظ الإجابة ✓' : 'لم تتم الإجابة بعد'}
            </div>
        `;
        
        container.appendChild(questionDiv);
        
        // تحميل الإجابة المحفوظة إذا وجدت
        if (savedAnswer) {
            userAnswers[q.id] = savedAnswer;
        }
    });
}

// ===========================================
// حفظ إجابات المستخدم
// ===========================================
function saveAnswer(questionId, answer) {
    userAnswers[questionId] = answer.trim();
    localStorage.setItem(`answer_${questionId}`, answer.trim());
    
    // تحديث حالة الحفظ
    const statusDiv = document.getElementById(`status_${questionId}`);
    if (statusDiv) {
        statusDiv.textContent = answer.trim() ? 'تم حفظ الإجابة ✓' : 'لم تتم الإجابة بعد';
        statusDiv.style.color = answer.trim() ? '#4CAF50' : '#aaa';
    }
    
    // إذا كان المسؤول مسجلاً، تحديث اللوحة
    if (isAdmin) {
        updateAdminPanel();
    }
}

// ===========================================
// عرض/إخفاء نافذة تسجيل الدخول
// ===========================================
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('adminPasswordHint').textContent = ADMIN_PASSWORD;
    generateCaptcha();
    document.getElementById('captchaAnswer').focus();
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('captchaAnswer').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

// ===========================================
// تسجيل دخول المسؤول
// ===========================================
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    const captchaAnswer = document.getElementById('captchaAnswer').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    // التحقق من الكابتشا
    if (parseInt(captchaAnswer) !== captchaSolution) {
        errorDiv.textContent = 'إجابة الكابتشا غير صحيحة';
        generateCaptcha();
        return;
    }
    
    // التحقق من كلمة المرور
    if (password !== ADMIN_PASSWORD) {
        errorDiv.textContent = 'كلمة المرور غير صحيحة';
        return;
    }
    
    // تسجيل الدخول الناجح
    isAdmin = true;
    hideLoginModal();
    document.getElementById('adminPanel').style.display = 'block';
    updateAdminPanel();
    
    // تمرير للأسفل لعرض لوحة المسؤول
    document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
}

// ===========================================
// تسجيل خروج المسؤول
// ===========================================
function logoutAdmin() {
    isAdmin = false;
    document.getElementById('adminPanel').style.display = 'none';
}

// ===========================================
// تحديث لوحة المسؤول
// ===========================================
function updateAdminPanel() {
    if (!isAdmin) return;
    
    const adminAnswersDiv = document.getElementById('adminAnswers');
    adminAnswersDiv.innerHTML = '';
    
    questions.forEach((q, index) => {
        const answer = userAnswers[q.id] || localStorage.getItem(`answer_${q.id}`) || 'لم يتم الإجابة بعد';
        
        const answerDiv = document.createElement('div');
        answerDiv.className = 'admin-answer';
        answerDiv.innerHTML = `
            <strong>السؤال ${index + 1}:</strong> ${q.text}<br>
            <strong style="color: #4CAF50">الإجابة:</strong> ${answer}
            <div style="margin-top: 5px; font-size: 12px; color: #888">
                ${answer !== 'لم يتم الإجابة بعد' ? 'تم الإجابة من قبل المستخدم' : 'بانتظار الإجابة'}
            </div>
        `;
        
        adminAnswersDiv.appendChild(answerDiv);
    });
}

// ===========================================
// دوال لتعديل الأسئلة من الكونسول
// ===========================================
// 1. تعديل سؤال موجود
function editQuestion(questionId, newText) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.text = newText;
        renderQuestions();
        if (isAdmin) updateAdminPanel();
        console.log(`تم تعديل السؤال ${questionId}`);
    } else {
        console.log(`لم يتم العثور على السؤال ${questionId}`);
    }
}

// 2. إضافة سؤال جديد
function addQuestion(newText) {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    questions.push({ id: newId, text: newText });
    renderQuestions();
    if (isAdmin) updateAdminPanel();
    console.log(`تم إضافة سؤال جديد برقم ${newId}`);
}

// 3. حذف سؤال
function deleteQuestion(questionId) {
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
        questions.splice(index, 1);
        renderQuestions();
        if (isAdmin) updateAdminPanel();
        console.log(`تم حذف السؤال ${questionId}`);
    } else {
        console.log(`لم يتم العثور على السؤال ${questionId}`);
    }
}

// ===========================================
// تهيئة الصفحة عند التحميل
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    // تحميل أي إجابات محفوظة مسبقاً
    questions.forEach(q => {
        const saved = localStorage.getItem(`answer_${q.id}`);
        if (saved) {
            userAnswers[q.id] = saved;
        }
    });
    
    // عرض الأسئلة
    renderQuestions();
    
    // إخفاء لوحة المسؤول في البداية
    document.getElementById('adminPanel').style.display = 'none';
    
    // إظهار كلمة المرور في الكونسول للاختبار
    console.log('=== معلومات الموقع ===');
    console.log('كلمة مرور المسؤول:', ADMIN_PASSWORD);
    console.log('عدد الأسئلة:', questions.length);
    console.log('\n=== أوامر التعديل من الكونسول ===');
    console.log('لتعديل سؤال: editQuestion(رقم, "النص الجديد")');
    console.log('لإضافة سؤال: addQuestion("نص السؤال الجديد")');
    console.log('لحذف سؤال: deleteQuestion(رقم)');
    console.log('\nمثال: editQuestion(1, "ما هو لون البحر؟")');
});

// ===========================================
// إغلاق نافذة التسجيل بالضغط على ESC
// ===========================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideLoginModal();
    }
});