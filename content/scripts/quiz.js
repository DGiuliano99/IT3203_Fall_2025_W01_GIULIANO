console.log("TEST");

const quiz_questions = [ //create list of question objects of various types (multiple-choice, multiple-selection, fill-in-blank)
    {
        str_question: "Who is credited for the creation of HTTP?",
        ls_answers: ["The Department of Defense", "Tim Berners-Lee", "Al Gore", "Steve Jobs"],
        str_answer: "Tim Berners-Lee",
        str_type: "multiple_choice"
    },
    {
        str_question: "Which of the following was developed to push data to web-applications and servers?",
        ls_answers: ["WebDAV", "Samba", "Bonjour", "HTTP"],
        str_answer: "WebDAV",
        str_type: "multiple_choice"
    },
    {
        str_question: "What type of request is used to send data to a server?",
        ls_answers: ["GET", "POST", "DELETE", "REVOKE"],
        str_answer: "POST",
        str_type: "multiple_choice"
    },
    {
        str_question: "Which of the following are valid HTTP request types?",
        ls_answers: ["GET", "POST", "SYNTHESIZE", "UPDATE", "REFORMAT", "DELETE"],
        ls_correct: ["True", "True"],
        answer_key: {"GET": "True", "POST": "True", "SYNTHESIZE": "False", "UPDATE": "True", "REFORMAT": "False", "DELETE": "True"},
        str_type: "multiple_selection"
    },
    {
        str_question: "HTTP is a client-server protocol in which a client sends a request to a ______.",
        str_answer: "SERVER",
        str_type: "fill_in_blank"
    }
]
const quiz_space = document.getElementById("quiz_space"); //create divider for quiz
const question_space = document.getElementById("q_space"); //create divider for question block
const answer_space = document.getElementById("a_space"); //create divider for answer block
const submit_space = document.getElementById("submit_choice"); //create divider for submit button
let current_question = 0; //set current question to 0, used to iterate through question list
let score = 0; //sets initial user score to 0
let multi_score = 0; //sets multi-score section to 0
let value = "False" //sets initial multi-score test value to false
get_question(); //init quiz
function get_question() { //create function to retrieve and display questions from list of various types.
    const question = quiz_questions[current_question]; //fetch question using counter
    question_space.innerText = question.str_question; //set question space text to question
    answer_space.innerText = ""; //clear the answer space
    if (question.str_type === "multiple_choice") { //if multiple-choice question then
        question.ls_answers.forEach(ls_answer => { //for each answer in question's answer choice list
            const button = document.createElement("button"); //create a button
            button.setAttribute("id", "quiz_choice") //set button stylings using id
            button.innerText = ls_answer; //set button text to answer choice
            answer_space.appendChild(button); //add the answer choice button to the answer divider
            button.addEventListener("click", make_choice); //on click of the answer choice, execute function make-choice.
        });
    } else if (question.str_type === "multiple_selection") { //define rules for creating multi-select questions
        question.ls_answers.forEach(ls_answer => { //for each answer in answer list
           const button = document.createElement("button"); //create a button
           button.setAttribute("id", "quiz_choice"); //styled as quiz-choice
           button.innerText = ls_answer; //with inner text of the answer choice
           answer_space.appendChild(button); //add the answer choice to the answer space
           button.addEventListener("click", make_multi_choice); //on click of answer choice, execute function make-multi-choice
        }); //end for each
        const sub_q_button = document.createElement("button"); //create another button
        sub_q_button.setAttribute("id", "quiz_submit"); //style as quiz-submit
        sub_q_button.innerText = "Submit"; //set text of submit button
        submit_space.appendChild(sub_q_button); //add submit button to submit divider
        sub_q_button.addEventListener("click",check_multi_choice); //on click of submit button, execute function check-multi-choice
    } else if (question.str_type === "fill_in_blank") { //define rules for creating fill in the blank questions
        const blank = document.createElement("input"); //create input box
        blank.setAttribute("type", "text"); //define as textbox
        blank.setAttribute("id", "answer"); //style as answer
        answer_space.appendChild(blank); //add text box to answer divider
        const submit_quiz_button = document.createElement("button"); //create submit button
        submit_quiz_button.setAttribute("id", "quiz_submit"); //style as quiz-submit
        submit_quiz_button.innerText = "Submit"; //set text to submit
        submit_space.appendChild(submit_quiz_button); //add submit button to submit divider
        submit_quiz_button.addEventListener("click", check_fill_in); //on click of submit button, execute function check-fil-in
    }
}
function make_choice(e) { //receive clicked button; define function to make answer choice selection; for multiple choice questions
    const selected_choice = e.target; //set selected choice to clicked answer
    const correct_choice = quiz_questions[current_question].str_answer; //set correct choice to current question's answer
    if (selected_choice.innerText === correct_choice) { //if the chosen answer choice matches the correct answer choice then
        score ++; //iterate score
    }
    advance_quiz() //call advance-quiz function
}
function make_multi_choice(e) { //receive clicked button; define function to toggle answer choice as selected; used for multi-select questions
    const selected_choice = e.target; //set clicked answer choice as selected-choice
    if (selected_choice.id === "quiz_choice") { //if button is not currently selected
        selected_choice.setAttribute("id", "selected_choice"); //set id to selected; change style
    } else { //if button is currently selected
        selected_choice.setAttribute("id", "quiz_choice"); //set id to unselected; change style
    }
}
function check_multi_choice() { //define function to check multiple choice answers
    multi_score = 0 //set multi-choice sub-score to 0
    const question = quiz_questions[current_question]; //set question as current questions
    Array.from(answer_space.children).forEach(choice => { //for each option in the answer divider
        if (choice.id === "quiz_choice") { //if id is quiz choice then
            value = "False"; //test value is false
        } else if (choice.id === "selected_choice") { //if id is selected-choice then
            value = "True"; //test value is true
        }
        if (question.answer_key[choice.innerText] === value) { //if the answer-key value for the answer choice matches the test value then
            multi_score ++; //iterate sub-score
        }
    })//end for each
    if (multi_score === question.ls_answers.length) { //if each item was chosen or unchosen correcly then
        score ++; //iterate overall score
    }
    const button = submit_space.children.namedItem("quiz_submit"); //set button to submit button
    submit_space.removeChild(button) //remove submit button
    advance_quiz() //call function advance-quiz
}
function get_result() { //define function get-result; presents final score to user
    question_space.innerHTML = `<h4>Quiz Completed</h4><p>Your score: ${score}/${quiz_questions.length}</p>`;//set inner html to result message
    const button = document.createElement("button"); //create a button
    button.setAttribute("id", "quiz_submit"); //set the button styling to quiz-submit
    button.innerText = "Retry"; //set button text to retry
    quiz_space.appendChild(button); //add button to quiz divider
    button.addEventListener("click", reset_quiz); //on click of button, execute function reset-quiz
}
function reset_quiz() { //define function to restore quiz to originial function
    const button = quiz_space.children.namedItem("quiz_submit"); //set button as current submit button
    quiz_space.removeChild(button) //remove button from quiz divider
    current_question = 0; //reset current question to 0
    score = 0; //reset score counter to 0
    multi_score = 0; //reset multi-score counter to 0
    get_question(); //call get-question function
}
function advance_quiz() { //define function to advance quiz to next question
    current_question++; //iterate question counter
    if (current_question < quiz_questions.length) { //if the next question is less than the total number in the quiz, then
        get_question(); //get next question; call get-question function
    } else {
        get_result(); //get quiz results; call get-result function
    }
}
function check_fill_in() { //define function to check fill in blank questions
    const question = quiz_questions[current_question]; //set question as current question
    const input = answer_space.children.namedItem("answer"); //set input to answer text box
    if (question.str_answer === input.value.toUpperCase()) { //if answer matches answer key (uppercase to prevent casing errors), then
        score ++; //iterate score
    }
    answer_space.removeChild(input) //remove textbox from answer space
    const button = submit_space.children.namedItem("quiz_submit"); //Set button as submit button
    submit_space.removeChild(button) //remove submit button from submit space.
    advance_quiz() //call function advance quiz
}