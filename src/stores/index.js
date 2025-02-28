const page = ref('choiceGetWhiteListMethod');

const testQuestions = ref(testQuestions1);

const bgStonePatterns = ref({
  height: undefined,
  list: [],
});
const examBg = useTemplateRef('examBg');
watch(examBg, (newExamBg) => {
  console.log(examBg);
  console.log(examBg.value);
  console.log(newExamBg);
  console.log(newExamBg.value);

  if (newExamBg) {
    generatePatterns(examBg, bgStonePatterns);
  }
});
// onMounted(() => {
//     generatePatterns(bgStonePatterns);
// });
function initExam() {
  const optionLabels = ['A', 'B', 'C', 'D'];
  for (let question of testQuestions.value) {
    question.answer = '';
    if (question.options) {
      question.options = question.options.map((optionTmp, index) => {
        return {
          label: optionLabels[index] || ``,
          text: optionTmp,
          select: false,
        };
      });
    }
  }
  countdown(1, (time) => {
    remainingTime.value = `剩余时间：${Math.floor(time / 60)} 分钟 ${time % 60}秒`;
  });

  // generatePatterns(bgStonePatterns);
}
const examineePlayer = {
  name: '',
};
function userIsConfirm() {
  if (page.value === 'guarantee') {
    text = showBox(infoCard, 5, {
      type: 'msg',
      text: '处理中...',
    });
    const fetchRequest = new Request(url + '/guarantee/request', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8;',
      },
      body: JSON.stringify(confirmRequest),
    });
    fetch(fetchRequest)
      .then((response) => {
        let result = response.json();
        result.then((res) => {
          if (res['state'] === 'success') {
            text = showBox(infoCard, 10, {
              type: 'msg',
              text: '申请在10分钟内有效，请通知对方尽快同意',
            });
          } else if (res['state'] === 'requestExists') {
            text = showBox(infoCard, 10, {
              type: 'msg',
              text: '已存在未过期的申请，最长10分钟后过期',
            });
          } else {
            text = showBox(warnCard, 5, {
              type: 'warn',
              text: res['state'],
            });
          }
        });
      })
      .catch((error) => {
        text = showBox(warnCard, 2, {
          type: 'warn',
          text: '服务器未响应/错误',
        });
        console.error('There has been a problem with your fetch operation:', error);
      });
  } else if (page.value === 'prepareForTheExam') {
    infoCard.value.display = false;
    page.value = 'examination';
    // const testQuestions = getTestQuestions(playerType); 等有了API再搞这个
    initExam();
  }
}
function selectOption(question, selectedOption) {
  if (question.type === 'singleChoice') {
    for (let opt of question.options) {
      opt.select = false;
    }
  }
  selectedOption.select = !selectedOption.select;
  question.answer = '';
  for (let opt of question.options) {
    if (opt.select) {
      question.answer += opt.label;
    }
  }
}

function submitTestPaper() {
  function checkDone() {
    for (let question of testQuestions.value) {
      if (question.answer === '') return false;
    }
    return true;
  }
  if (!checkDone()) {
    alert('请完成全部题目后再交卷！');
  } else {
    alert('答题成功');
    const tmp = [];
    for (let question of testQuestions.value) {
      tmp.push({ id: question.id, answer: question.answer });
    }
    const data = {
      examineeInfo: {
        qqNumber: examineeInfo.value['qqNumber'],
        playerName: examineeInfo.value['playerName'],
        playerType: examineeInfo.value['playerType'],
      },
      anwerList: tmp,
    };
    console.log(data);
  }
}
const resultPage = ref('getInfo');
const showExamResult = ref({
  id: 0,
  type: '',
  time: '',
  status: '',
  showScore: 0,
  score: 0,
  state: 0,
  stateDisplay: false,
});
const guaranteeResult = ref({
  state: true,
  text: '您的担保请求已被同意，系统已自动将您添加至白名单',
});

// const guaranteeResult = ref({
//     state: false,
//     text: "非常抱歉，您的担保请求已被拒绝，如有需要请重新申请",
// });
const examList = ref(examList1);
function selectShowExam(selectID) {
  showExamResult.value = examList.value.find((exam) => exam.id === selectID);
  resultPage.value = 'showScore';
  showExamResult.value.display = false;
  animateValue(0, showExamResult.value.score, 2000, (value) => {
    showExamResult.value.showScore = value;
  });
}
const animateValue = (start, end, duration, callback) => {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);
  const value = start + (end - start) * progress;
  callback(Math.round(value));

  if (progress < 1) {
    requestAnimationFrame(animate);
  }
  if (showExamResult.value.showScore === showExamResult.value.score) {
    showExamResult.value.display = true;
  }
};

requestAnimationFrame(animate);

watch(page, (newVal) => {
  if (newVal === 'viewResult') {
    resultPage.value = 'getInfo';
  }
});

const styleVariables = computed(() => ({
  '--showScore': `${100 - showExamResult.value.score}%`,
}));
const startTime = performance.now();
