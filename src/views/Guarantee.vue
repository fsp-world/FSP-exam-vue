<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import InfoDialog from '@/components/InfoDialog.vue'
import { getProfilePic } from '@/apis/mj.js'
import { sendRequest } from '@/apis/guarantee.js'
const dialogData = ref({
    display: false,
    stats: 0,
    type: 'info-card',
    style: {
    },
    desc: ''
})
const info = ref({
    uuid: "",
    opacity: 1,
    imgUrl: "",
});

const isin = ref(false)
const warnCard = ref({
    type: "",
    display: false,
    text: "",
    opacity: 1,
    imgUrl: "",
});
const guaranteeRequest = ref({
    guaranteeQQ: "",
    playerQQ: "",
    playerName: "",
});

const check = ref(false)

const checkData = (event) => {
    let a = '' + event.target.value
    let rex = /^[a-zA-Z0-9_]{3,16}$/i
    if (rex.test(a)) {
        check.value = true
    } else {
        check.value = false
    }
}

function openErroDialog(desc) {
    dialogData.value.type = 'warn-card'
    dialogData.value.display = true
    dialogData.value.stats = 2
    dialogData.value.desc = desc
    setTimeout(() => {
        dialogData.value.display = false
    }, 3000)
}

function openLoadDialog() {
    dialogData.value.type = 'info-card'
    dialogData.value.display = true
    dialogData.value.stats = 0
}

function openInfoDialog() {
    dialogData.value.type = 'info-card'
    dialogData.value.display = true
    dialogData.value.stats = 1
}

function send() {
    openLoadDialog()
    sendRequest({
        guaranteeQQ: '' + guaranteeRequest.value.guaranteeQQ,
        playerQQ: '' + guaranteeRequest.value.playerQQ,
        playerName: guaranteeRequest.value.playerName,
        playerUUID: info.value.uuid
    }).then((res) => {
        isin.value = false
        openErroDialog(res.data.desc)
    }).catch((err) => {
        console.log(err.data);
    })
}

function show() {
    if (guaranteeRequest.value.guaranteeQQ && guaranteeRequest.value.playerQQ) {
        if (check.value) {
            isin.value = true
            openLoadDialog()
            new Promise((resolve, reject) => {
                getProfilePic(guaranteeRequest.value.playerName).then((result) => {
                    if (result.msg == 'ok') {
                        result.imgUrl.then((url) => {
                            info.value.imgUrl = url
                        })
                        info.value.uuid = result.uuid
                        resolve()
                    } else {
                        reject()
                    }
                })
            }).then(() => {
                openInfoDialog()
            }).catch(() => {
                isin.value = false
                openErroDialog('查询错误!!!')
            })
        } else {
            openErroDialog('昵称不合法！')
        }
    } else {
        openErroDialog('qq号为空')
    }
}

</script>

<template>
    <InfoDialog :show="dialogData.display" :dialogType="dialogData.type" :dialogStyle="dialogData.style">
        <div style="line-height: 120px; font-size: 40px;" v-show="dialogData.stats === 0">加载中</div>
        <div v-show="dialogData.stats === 1">
            <div class="top">
                <img class="player-pic" :src="info.imgUrl" />
                <p class="player-name">Name: {{ guaranteeRequest.playerName }}</p>
                <button class="minecraft-button button confirm-btn" type="button" @click="send()">
                    确认无误
                </button>
            </div>
            <p class="bottom player-uuid">uuid: {{ info.uuid }}</p>
        </div>
        <div style="line-height: 120px; font-size: 40px;" v-show="dialogData.stats === 2">
            <p>{{ dialogData.desc }}</p>
        </div>
    </InfoDialog>
    <div class="guarantee">
        <div class="bg"></div>
        <div class="content">
            <div class="title">
                <p>熟人担保</p>
            </div>
            <div class="main">
                <div class="form">
                    <p class="text">
                        该玩家在网站上同意您的请求后您将获得白名单
                    </p>
                    <input :disabled="isin" type="number" placeholder="对方的QQ号" v-model="guaranteeRequest.guaranteeQQ"
                        :class="{ 'input-red-color': warnCard.display }" />
                    <input :disabled="isin" type="number" placeholder="您的QQ号" v-model="guaranteeRequest.playerQQ"
                        :class="{ 'input-red-color': warnCard.display }" />
                    <input @input="event => checkData(event)" :disabled="isin" type="text" placeholder="您的游戏昵称"
                        v-model="guaranteeRequest.playerName" :class="{ 'input-red-color': check }" />
                </div>
            </div>
            <div class="end">
                <button type="button" class="minecraft-button button">
                    <RouterLink to="/">返回</RouterLink>
                </button>
                <button type="button" :disabled="isin" class="minecraft-button button" @click="show()">
                    提交
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.top {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.confirm-btn {
    width: 200px;
    height: 50px;
    font-size: 1.35rem;
}

.player-name {
    font-size: 30px;
}

.player-pic {
    width: 50px;
    image-rendering: pixelated;
}

.player-uuid {
    height: 60px;
    line-height: 60px;
    width: 100%;
    text-align: center;
}
</style>