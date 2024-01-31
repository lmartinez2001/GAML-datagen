const answerArea = document.querySelector('#answer-area')
const questionArea = document.querySelector('#question-area')
const warningMsg = document.querySelector('#warning-msg')
const submitButton = document.querySelector('#submit-btn')
const instructionsTitle = document.querySelector('#instructions-title')
const instructionsText = document.querySelector('.md-block')
const instructionsIndicator = document.querySelector('#instructions-indicator')
const nicknameInput = document.querySelector('.nickname-input')

const colors = { white: '#EBEDF0', red: '#F85149', green: '#24a73e' }

const msgs = {
  default: {
    msg: 'Fill Question and Answer sections to submit',
    color: colors.white,
  },
  qwarning: {
    msg: 'Fill Question section to submit',
    color: colors.white,
  },
  awarning: {
    msg: 'Fill Answer section to submit',
    color: colors.white,
  },
  success: {
    msg: 'Prompt succesfully sent',
    color: colors.green,
  },
  fail: {
    msg: 'Failed to send prompt to server. Please contact an admin',
    color: colors.red,
  },
  sending: {
    msg: 'Sending prompt...',
    color: colors.white,
  },
}

questionArea.addEventListener('input', () => {
  checkAreasFilled()
})

answerArea.addEventListener('input', (event) => {
  checkAreasFilled()
})

submitButton.addEventListener('click', () => {
  // feed prompt q&a
  const nickname = nicknameInput.value ? nicknameInput.value : 'Guest'
  warningMsg.innerText = msgs.sending.msg
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
          nickname
        }
      }   
      `,
      variables: {
        input: {
          question: questionArea.value,
          answer: answerArea.value,
          nickname: nickname,
        },
      },
    },
  }).then((result) => {
    res = result.data
    if (res.errors) {
      console.log(res.errors)
      setMessage(msgs.fail)
    } else {
      setMessage(msgs.success)
    }
  })

  // Empty text area
  questionArea.value = ''
  answerArea.value = ''

  submitButton.disabled = true

  // setMessage(msgs.success)
})

const setMessage = (message) => {
  warningMsg.innerText = message.msg
  warningMsg.style.color = message.color

  setTimeout(() => {
    warningMsg.innerText = msgs.default.msg
    warningMsg.style.color = msgs.default.color
  }, 1000)
}

const checkAreasFilled = () => {
  submitButton.disabled = questionArea.value === '' || answerArea.value === ''
}

instructionsTitle.addEventListener('click', () => {
  var classlist = instructionsText.classList
  classlist.toggle('invisible')
  if (classlist.contains('invisible')) {
    instructionsIndicator.classList.remove('fa-angle-down')
    instructionsIndicator.classList.add('fa-angle-up')
  } else {
    instructionsIndicator.classList.remove('fa-angle-up')
    instructionsIndicator.classList.add('fa-angle-down')
  }
})
