const nicknameInput = document.querySelector('.nickname-input')
const questionArea = document.querySelector('#question-area')
const answerArea = document.querySelector('#answer-area')
const warningMsg = document.querySelector('#warning-msg')
const submitButton = document.querySelector('#submit-btn')

const instructionsTitle = document.querySelector('#instructions-title')
const instructionsIndicator = document.querySelector('#instructions-indicator')
const instructionsText = document.querySelector('.md-block')

const promptsTitle = document.querySelector('#prompts-title')
const promptsIndicator = document.querySelector('#prompts-indicator')
const promptsWrapper = document.querySelector('#prompts-wrapper')

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

// Check if question and answer areas are filled to enable the Submit button
questionArea.addEventListener('input', () => {
  checkAreasFilled()
})

answerArea.addEventListener('input', (event) => {
  checkAreasFilled()
})

// Send inputed data to the database
submitButton.addEventListener('click', () => {
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
})

// Manage the content of the text under the textareas
const setMessage = (message) => {
  warningMsg.innerText = message.msg
  warningMsg.style.color = message.color

  setTimeout(() => {
    warningMsg.innerText = msgs.default.msg
    warningMsg.style.color = msgs.default.color
  }, 1000)
}

// Disable the Submit button as long as both question and answer areas are not filled
const checkAreasFilled = () => {
  submitButton.disabled = questionArea.value === '' || answerArea.value === ''
}

// Toogle Instructions section visibility
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

// Toogle Prompts section visibility
promptsTitle.addEventListener('click', () => {
  var classlist = promptsWrapper.classList
  classlist.toggle('invisible')
  if (classlist.contains('invisible')) {
    promptsIndicator.classList.remove('fa-angle-down')
    promptsIndicator.classList.add('fa-angle-up')
  } else {
    promptsIndicator.classList.remove('fa-angle-up')
    promptsIndicator.classList.add('fa-angle-down')
  }
})

// MANAGE DISPLAY OF DATABASE SAMPLES
const promptsContainer = document.querySelector('.prompts-container')
const promptsCounter = document.querySelector('.prompts-counter')
const promptsNicknames = document.querySelector('.prompts-nicknames')

const fetchDbData = async () => {
  const data = await axios({
    url: `${document.location.origin}/graphql`,
    method: 'get',
    data: {
      query: `
      query Prompts {
        prompts {
          question
          answer
          nickname
        }
      }   
      `,
    },
  })

  // const data = await fetch('res/prompts.json')
  const jsonData = await data.json()
  return jsonData.data.prompts
}

const addDbContent = async () => {
  var nicknameOccurences = {}
  const data = await fetchDbData()
  promptsCounter.innerText = `${data.length} samples in the dataset`

  data.forEach((prompt) => {
    const sample = document.createElement('div')
    sample.className = 'sample-container'

    var answer = prompt.answer
    answer = answer.replace(/\n/g, '<br>')
    answer = answer.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')

    var nickname = prompt.nickname
    nickname = nickname.replace(/\s+/g, '')
    if (nicknameOccurences[nickname] === undefined) {
      nicknameOccurences[nickname] = 1
    } else {
      nicknameOccurences[nickname]++
    }

    sample.innerHTML = `
        <h3 class="sample-nickname small-bottom-separation">${prompt.nickname}</h3>
        <h4 class="sample-subtitle">Question</h4>
        <div class="sample-question-container">
          <p class="sample-question small-bottom-separation">${prompt.question}</p>
        </div>
        <h4 class="sample-subtitle">Answer</h4>
        <div class="sample-answer-container">
          <p class="sample-answer">${answer}</p>
        </div>
    `
    promptsContainer.appendChild(sample)
  })

  var sortedNicknames = Object.keys(nicknameOccurences).sort(function (a, b) {
    return nicknameOccurences[b] - nicknameOccurences[a]
  })

  sortedNicknames.forEach((nickname) => {
    const sample = document.createElement('p')
    sample.className = 'prompts-nickname-sample'

    sample.innerText = `${nickname} - ${nicknameOccurences[nickname]}`
    promptsNicknames.appendChild(sample)
  })
}

addDbContent()
