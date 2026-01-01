// بيانات أولية للأسئلة
const initialQuestions = [
    {
        id: 1,
        question: "ما هي عاصمة المملكة العربية السعودية؟",
        answer: "الرياض",
        category: "general",
        date: "2023-10-15"
    },
    {
        id: 2,
        question: "من هو أول رسول أرسله الله إلى البشر؟",
        answer: "سيدنا نوح عليه السلام",
        category: "islamic",
        date: "2023-10-14"
    },
    {
        id: 3,
        question: "ما هي لغة البرمجة المستخدمة في تطوير صفحات الويب؟",
        answer: "HTML، CSS، JavaScript",
        category: "tech",
        date: "2023-10-13"
    },
    {
        id: 4,
        question: "كم عدد أركان الإسلام؟",
        answer: "خمسة أركان: الشهادتان، الصلاة، الزكاة، الصوم، الحج",
        category: "islamic",
        date: "2023-10-12"
    },
    {
        id: 5,
        question: "ما هو الغاز الذي تحتاجه النباتات للقيام بعملية البناء الضوئي؟",
        answer: "ثاني أكسيد الكربون (CO2)",
        category: "scientific",
        date: "2023-10-11"
    },
    {
        id: 6,
        question: "ما هي أصغر وحدة بناء في الكائنات الحية؟",
        answer: "الخلية",
        category: "scientific",
        date: "2023-10-10"
    },
    {
        id: 7,
        question: "من الذي أسس الدولة الأموية؟",
        answer: "معاوية بن أبي سفيان رضي الله عنه",
        category: "education",
        date: "2023-10-09"
    },
    {
        id: 8,
        question: "ما هو نظام التشغيل الأكثر استخداماً في الهواتف الذكية؟",
        answer: "أندرويد (Android)",
        category: "tech",
        date: "2023-10-08"
    },
    {
        id: 9,
        question: "كم عدد سور القرآن الكريم؟",
        answer: "114 سورة",
        category: "islamic",
        date: "2023-10-07"
    },
    {
        id: 10,
        question: "ما هي أطول سورة في القرآن الكريم؟",
        answer: "سورة البقرة",
        category: "islamic",
        date: "2023-10-06"
    }
];

// تهيئة التطبيق
class QuestionApp {
    constructor() {
        this.questions = this.loadQuestions();
        this.editingId = null;
        this.init();
    }

    // تحميل الأسئلة من localStorage
    loadQuestions() {
        const saved = localStorage.getItem('questionsData');
        if (saved) {
            return JSON.parse(saved);
        } else {
            localStorage.setItem('questionsData', JSON.stringify(initialQuestions));
            return initialQuestions;
        }
    }

    // حفظ الأسئلة في localStorage
    saveQuestions() {
        localStorage.setItem('questionsData', JSON.stringify(this.questions));
        this.updateStats();
    }

    // تحديث الإحصائيات
    updateStats() {
        const total = this.questions.length;
        const answered = this.questions.filter(q => q.answer && q.answer.trim() !== '').length;
        
        document.getElementById('totalQuestions').textContent = total;
        document.getElementById('answeredQuestions').textContent = answered;
    }

    // عرض الأسئلة
    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';

        if (this.questions.length === 0) {
            container.innerHTML = `
                <div class="no-questions">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
                    <h3>لا توجد أسئلة بعد</h3>
                    <p>انقر على "سؤال جديد" لإضافة أول سؤال</p>
                </div>
            `;
            return;
        }

        this.questions.forEach(question => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.dataset.id = question.id;
            
            const categories = {
                'general': 'عام',
                'education': 'تعليمي',
                'tech': 'تقني',
                'islamic': 'إسلامي',
                'scientific': 'علمي'
            };

            card.innerHTML = `
                <div class="question-header">
                    <div class="question-text">${question.question}</div>
                    <div class="question-actions">
                        <button class="action-btn edit-btn" data-id="${question.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${question.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="question-meta">
                    <div>
                        <span><i class="fas fa-calendar"></i> ${question.date}</span>
                    </div>
                    <span class="category">${categories[question.category] || question.category}</span>
                </div>
                
                <div class="answer" style="display: none;">
                    <h4><i class="fas fa-lightbulb"></i> الإجابة:</h4>
                    <p>${question.answer || '<span class="no-answer">لا توجد إجابة بعد</span>'}</p>
                </div>
            `;

            // حدث النقر لعرض/إخفاء الإجابة
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.question-actions')) {
                    const answerDiv = card.querySelector('.answer');
                    const isVisible = answerDiv.style.display === 'block';
                    
                    answerDiv.style.display = isVisible ? 'none' : 'block';
                    card.classList.toggle('expanded', !isVisible);
                }
            });

            // حدث زر التعديل
            const editBtn = card.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editQuestion(question.id);
            });

            // حدث زر الحذف
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteQuestion(question.id);
            });

            container.appendChild(card);
        });
    }

    // تعديل سؤال
    editQuestion(id) {
        const question = this.questions.find(q => q.id === id);
        if (!question) return;

        this.editingId = id;
        
        document.getElementById('formTitle').textContent = 'تعديل السؤال';
        document.getElementById('questionId').value = id;
        document.getElementById('questionText').value = question.question;
        document.getElementById('answerText').value = question.answer || '';
        document.getElementById('questionCategory').value = question.category;
        
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
    }

    // حذف سؤال
    deleteQuestion(id) {
        if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            this.questions = this.questions.filter(q => q.id !== id);
            this.saveQuestions();
            this.renderQuestions();
            this.resetForm();
        }
    }

    // إضافة/تعديل سؤال
    handleSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('questionId').value;
        const questionText = document.getElementById('questionText').value.trim();
        const answerText = document.getElementById('answerText').value.trim();
        const category = document.getElementById('questionCategory').value;

        if (!questionText) {
            alert('يرجى إدخال نص السؤال');
            return;
        }

        if (id) {
            // تعديل سؤال موجود
            const index = this.questions.findIndex(q => q.id === parseInt(id));
            if (index !== -1) {
                this.questions[index] = {
                    ...this.questions[index],
                    question: questionText,
                    answer: answerText,
                    category: category
                };
            }
        } else {
            // إضافة سؤال جديد
            const newId = this.questions.length > 0 ? Math.max(...this.questions.map(q => q.id)) + 1 : 1;
            const newQuestion = {
                id: newId,
                question: questionText,
                answer: answerText,
                category: category,
                date: new Date().toISOString().split('T')[0]
            };
            this.questions.unshift(newQuestion);
        }

        this.saveQuestions();
        this.renderQuestions();
        this.resetForm();
        
        alert(id ? 'تم تحديث السؤال بنجاح!' : 'تم إضافة السؤال بنجاح!');
    }

    // إعادة تعيين النموذج
    resetForm() {
        this.editingId = null;
        document.getElementById('questionForm').reset();
        document.getElementById('questionId').value = '';
        document.getElementById('formTitle').textContent = 'أضف سؤالاً جديداً';
    }

    // إعادة تعيين كل البيانات
    resetAllData() {
        if (confirm('هل أنت متأكد من حذف جميع الأسئلة؟ هذه العملية لا يمكن التراجع عنها.')) {
            this.questions = [...initialQuestions];
            this.saveQuestions();
            this.renderQuestions();
            this.resetForm();
            alert('تم إعادة تعيين جميع البيانات إلى الحالة الافتراضية');
        }
    }

    // تهيئة التطبيق
    init() {
        // عرض الأسئلة والإحصائيات
        this.renderQuestions();
        this.updateStats();

        // أحداث النموذج
        document.getElementById('questionForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.resetForm());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAllData());
        document.getElementById('addNewBtn').addEventListener('click', () => {
            this.resetForm();
            document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
        });

        // زر للانتقال للأعلى (إضافي)
        this.addScrollToTopButton();
    }

    // إضافة زر للانتقال للأعلى
    addScrollToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'scroll-top-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(button);

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            button.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
    }
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new QuestionApp();
});