// TODO:
// - [] syntax highlighting
// - [] send question and answer to a backend
// - [x] make sure that both question and answer fields are filled
// - [x] clear them after submission
// - [x] convert q&a to json before sending them

const answerArea = document.querySelector('#answer-area')
const questionArea = document.querySelector('#question-area')
const warningMsg = document.querySelector('#warning-msg')
const submitButton = document.querySelector('#submit-btn')
const instructionsTitle = document.querySelector('#instructions-title')
const instructionsText = document.querySelector('.md-block')
const instructionsIndicator = document.querySelector('#instructions-indicator')

const msgs = {
  default: 'Fill Question and Answer sections to submit',
  qwarning: 'Fill Question section to submit',
  awarning: 'Fill Answer section to submit',
  success: 'Prompt succesfully sent',
}

questionArea.addEventListener('input', () => {
  checkAreasFilled()
})

answerArea.addEventListener('input', (event) => {
  checkAreasFilled()
})

submitButton.addEventListener('click', () => {
  // feed prompt q&a
  axios({
    url: `${document.location.origin}/graphql`,
    method: 'post',
    data: {
      query: `
      mutation CreatePrompt($input: PromptInput!) 
      {
        createPrompt(input: $input) {
          id
          question
          answer
        }
      }   
      `,
      variables: {
        input: {
          question: questionArea.value,
          answer: answerArea.value,
        },
      },
    },
  }).then((result) => {
    console.log(result.data)
  })

  //   empty text area
  questionArea.value = ''
  answerArea.value = ''

  warningMsg.innerText = msgs.success

  submitButton.disabled = true

  setTimeout(() => {
    warningMsg.innerText = msgs.default
  }, 1000)
})

const checkAreasFilled = () => {
  submitButton.disabled = questionArea.value === '' || answerArea.value === ''
}

instructionsTitle.addEventListener('click', () => {
  var classlist = instructionsText.classList
  classlist.toggle('invisible')
  if (classlist.contains('invisible')) {
    instructionsIndicator.classList.remove('fa-angle-up')
    instructionsIndicator.classList.add('fa-angle-down')
  } else {
    instructionsIndicator.classList.remove('fa-angle-down')
    instructionsIndicator.classList.add('fa-angle-up')
  }
})
