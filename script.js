// ===========================================
// البيانات الأساسية - الأسئلة المخزنة في السكربت
// ===========================================

// كلمة مرور المسؤول - يمكنك تغييرها هنا
const ADMIN_PASSWORD = "admin123";

// الأسئلة الأساسية المخزنة في السكربت
let questionsData = [
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

// تخزين إجابات المستخدمين
let userAnswers = {};

// ===========================================
// نظام كشف الروبوت (CAPTCHA)
// ===========================================

let captchaSolution = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaSolution = num1 + num2;
    document.getElementById('captchaQuestion').textContent = `${num1} + ${num2} = ?`;
}

// ===========================================
// عرض الأسئلة للمستخدمين
// ===========================================

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    questionsData.forEach(q => {
        const div = document.createElement('div');
        div.className = 'question';
        div.innerHTML = `
            <p>${q.id}. ${q.text}</p>
            <textarea 
                class="answer-input" 
                placeholder="اكتب إجابتك هنا..."
                data-id="${q.id}"
                oninput="saveAnswer(${q.id}, this.value)"
            >${userAnswers[q.id] || ''}</textarea>
        `;
        container.appendChild(div);
    });
}

// حفظ إجابات المستخدم
function saveAnswer(questionId, answer) {
    userAnswers[questionId] = answer.trim();
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    updateAdminPanel();
}

// ===========================================
// نظام المسؤول
// ===========================================

function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    const captchaAnswer = document.getElementById('captchaAnswer').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    // التحقق من كلمة المرور
    if (password !== ADMIN_PASSWORD) {
        errorDiv.textContent = 'كلمة المرور غير صحيحة';
        return;
    }
    
    // التحقق من CAPTCHA
    if (parseInt(captchaAnswer) !== captchaSolution) {
        errorDiv.textContent = 'إجابة التحقق غير صحيحة';
        generateCaptcha(); // توليد كابتشا جديدة
        return;
    }
    
    // تسجيل الدخول الناجح
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // تحديث لوحة المسؤول
    updateAdminPanel();
}

function logoutAdmin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('captchaAnswer').value = '';
    generateCaptcha(); // توليد كابتشا جديدة
}

function updateAdminPanel() {
    const adminDiv = document.getElementById('adminAnswers');
    adminDiv.innerHTML = '';
    
    questionsData.forEach(q => {
        const answer = userAnswers[q.id] || 'لا توجد إجابة بعد';
        const div = document.createElement('div');
        div.className = 'admin-answer';
        div.innerHTML = `
            <strong>السؤال ${q.id}:</strong> ${q.text}<br>
            <strong>الإجابة:</strong> ${answer}
        `;
        adminDiv.appendChild(div);
    });
}

// ===========================================
// تعديل الأسئلة من السكربت
// ===========================================

// دالة لتعديل الأسئلة - يمكنك استدعاؤها من console المتصفح
function editQuestion(questionId, newQuestion) {
    const index = questionsData.findIndex(q => q.id === questionId);
    if (index !== -1) {
        questionsData[index].text = newQuestion;
        localStorage.setItem('questionsData', JSON.stringify(questionsData));
        renderQuestions();
        updateAdminPanel();
        console.log('تم تعديل السؤال بنجاح');
    } else {
        console.log('السؤال غير موجود');
    }
}

// دالة لإضافة سؤال جديد
function addQuestion(newQuestionText) {
    const newId = questionsData.length > 0 ? Math.max(...questionsData.map(q => q.id)) + 1 : 1;
    questionsData.push({ id: newId, text: newQuestionText });
    localStorage.setItem('questionsData', JSON.stringify(questionsData));
    renderQuestions();
    updateAdminPanel();
    console.log('تم إضافة السؤال بنجاح');
}

// دالة لحذف سؤال
function deleteQuestion(questionId) {
    questionsData = questionsData.filter(q => q.id !== questionId);
    localStorage.setItem('questionsData', JSON.stringify(questionsData));
    renderQuestions();
    updateAdminPanel();
    console.log('تم حذف السؤال بنجاح');
}

// ===========================================
// التهيئة عند تحميل الصفحة
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات المحفوظة
    const savedQuestions = localStorage.getItem('questionsData');
    if (savedQuestions) {
        questionsData = JSON.parse(savedQuestions);
    }
    
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
        userAnswers = JSON.parse(savedAnswers);
    }
    
    // توليد كابتشا أولية
    generateCaptcha();
    
    // عرض الأسئلة
    renderQuestions();
    
    // إظهار كلمة المرور في الكونسول لسهولة الاختبار
    console.log('كلمة مرور المسؤول:', ADMIN_PASSWORD);
    console.log('للتعديل من الكونسول:');
    console.log('editQuestion(رقم, "نص السؤال الجديد")');
    console.log('addQuestion("نص السؤال الجديد")');
    console.log('deleteQuestion(رقم)');
});