// بيانات الأسئلة الافتراضية
const initialQuestions = [
    {
        id: 1,
        text: "ما هي أفضل طريقة لتعلم البرمجة للمبتدئين؟",
        category: "education",
        name: "أحمد",
        date: "2023-10-15"
    },
    {
        id: 2,
        text: "كيف يمكنني استضافة موقع ويب مجاناً؟",
        category: "tech",
        name: "سارة",
        date: "2023-10-14"
    },
    {
        id: 3,
        text: "ما هي أفضل الكتب العربية للقراءة هذا العام؟",
        category: "general",
        name: "محمد",
        date: "2023-10-13"
    },
    {
        id: 4,
        text: "ما هي الخطوات الأساسية لإنشاء مشروع ناجح؟",
        category: "general",
        name: "ليلى",
        date: "2023-10-12"
    },
    {
        id: 5,
        text: "كيف أبدأ في تعلم الذكاء الاصطناعي؟",
        category: "education",
        name: "خالد",
        date: "2023-10-11"
    },
    {
        id: 6,
        text: "ما هي أفضل منصات التعلم عبر الإنترنت؟",
        category: "education",
        name: "نور",
        date: "2023-10-10"
    }
];

// تحميل الأسئلة من localStorage أو استخدام البيانات الافتراضية
let questions = JSON.parse(localStorage.getItem('arabicQuestions')) || initialQuestions;

// العناصر DOM
const questionsContainer = document.querySelector('.questions-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const questionForm = document.getElementById('questionForm');

// عرض الأسئلة
function displayQuestions(filter = 'all') {
    questionsContainer.innerHTML = '';
    
    const filteredQuestions = filter === 'all' 
        ? questions 
        : questions.filter(question => question.category === filter);
    
    if (filteredQuestions.length === 0) {
        questionsContainer.innerHTML = '<p class="no-questions">لا توجد أسئلة في هذه الفئة بعد.</p>';
        return;
    }
    
    // ترتيب الأسئلة من الأحدث إلى الأقدم
    filteredQuestions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredQuestions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.dataset.category = question.category;
        
        const categoryArabic = {
            'general': 'عامة',
            'tech': 'تقنية',
            'education': 'تعليمية'
        };
        
        questionElement.innerHTML = `
            <h3>${question.text}</h3>
            <div class="question-meta">
                <div>
                    <span><i class="fas fa-user"></i> ${question.name || "مجهول"}</span>
                    <span style="margin-right: 15px;"><i class="fas fa-calendar"></i> ${question.date}</span>
                </div>
                <span class="category ${question.category}">${categoryArabic[question.category]}</span>
            </div>
        `;
        
        questionsContainer.appendChild(questionElement);
    });
}

// فلترة الأسئلة
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // إزالة النشاط من جميع الأزرار
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // إضافة النشاط للزر المختار
        button.classList.add('active');
        
        // عرض الأسئلة المفلترة
        displayQuestions(button.dataset.filter);
    });
});

// إضافة سؤال جديد
questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const questionText = document.getElementById('questionText').value;
    const questionCategory = document.getElementById('questionCategory').value;
    const questionerName = document.getElementById('questionerName').value || "مجهول";
    
    if (!questionText || !questionCategory) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // إنشاء سؤال جديد
    const newQuestion = {
        id: questions.length + 1,
        text: questionText,
        category: questionCategory,
        name: questionerName,
        date: new Date().toISOString().split('T')[0] // تاريخ اليوم بصيغة YYYY-MM-DD
    };
    
    // إضافة السؤال للقائمة
    questions.unshift(newQuestion);
    
    // حفظ في localStorage
    localStorage.setItem('arabicQuestions', JSON.stringify(questions));
    
    // إعادة تعيين النموذج
    questionForm.reset();
    
    // عرض الأسئلة مع الفلترة الحالية
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    displayQuestions(activeFilter);
    
    // إظهار رسالة نجاح
    alert('تم إضافة سؤالك بنجاح!');
});

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // عرض جميع الأسئلة عند التحميل
    displayQuestions();
    
    // تهيئة البيانات في localStorage إذا لم تكن موجودة
    if (!localStorage.getItem('arabicQuestions')) {
        localStorage.setItem('arabicQuestions', JSON.stringify(initialQuestions));
    }
});