<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import InfoDialog from '../components/InfoDialog.vue'
import { getProfilePic } from '../utils/mj.js'
const dialogData = ref({
    display: false,
    stats: 0,
    type: 'info-card',
    style: {
    }
})
const info = ref({
    name: 'tangsu99',
    uuid: "",
    opacity: 1,
    imgUrl: "",
});

function show() {
    dialogData.value.display = true
    dialogData.value.stats = 0
    new Promise((resolve, reject) => {
        getProfilePic(guaranteeRequest.value.playerName).then((result) => {
            if (result.msg == 'ok') {
                result.imgUrl.then((url) => {
                    info.value.imgUrl = url
                })
                info.value.uuid = result.uuid
                resolve(1)
            } else {
                reject(2)
            }
        })
    }).then((res) => {
        dialogData.value.type = 'info-card'
        dialogData.value.stats = res
    }).catch((res) => {
        dialogData.value.type = 'warn-card'
        dialogData.value.stats = res
        setTimeout(() => {
            dialogData.value.display = false
        }, 4000)
    })
}
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
// const confirmRequest = {
//     guaranteeQQ: "",
//     playerQQ: "",
//     playerName: "",
//     playerUUID: "none",
// };

// function checkDataNotNull(data) {
//     for (let i in data) {
//         if (data[i] == "") return false;
//     }
//     return true;
// }
// function showBox(box, showSecond, data) {
//     box.value.type = data.type;
//     if (data.type === "loading" || data.type === "msg") {
//         box.value.text = data.text;
//         box.value.opacity = 1;
//         box.value.display = true;
//     } else if (data.type === "warn") {
//         box.value.text = data.text;
//         box.value.opacity = 1;
//         box.value.display = true;
//     } else if (data.type === "playerCheck") {
//         box.value.text = data.uuid;
//         box.value.imgUrl = data.profilePicSrc;
//         box.value.opacity = 1;
//         box.value.display = true;
//     }

//     setTimeout(() => {
//         const fadeOutInterval = setInterval(() => {
//             if (box.value.opacity > 0) {
//                 box.value.opacity -= 0.1;
//             } else {
//                 clearInterval(fadeOutInterval);
//                 box.value.display = false;
//             }
//         }, 100); // 消失动画时长
//     }, showSecond * 1000);
// }

// function checkPlayerName(playerName) {
//     showBox(infoCard, 1000, {
//         // tag1
//         type: "loading",
//         text: "确认游戏名称中...",
//     });
//     getProfilePic(playerName).then((result) => {
//         if (result.msg === "ok") {
//             result.imgUrl.then((imageUrl) => {
//                 confirmRequest["playerUUID"] = result.uuid;
//                 showBox(infoCard, 1000, {
//                     //我不知道为什么这里的1000没用，只有tag1的1000有用
//                     type: "playerCheck",
//                     uuid: confirmRequest["playerUUID"],
//                     profilePicSrc: imageUrl,
//                 });
//             });
//         } else {
//             infoCard.value.display = false;
//             showBox(warnCard, 2, {
//                 type: "warn",
//                 text: result.msg,
//             });
//         }
//     });
// }

// function oderGuaranteeRequest() {
//     confirmRequest["guaranteeQQ"] = guaranteeRequest.value["guaranteeQQ"];
//     confirmRequest["playerQQ"] = guaranteeRequest.value["playerQQ"];
//     confirmRequest["playerName"] = guaranteeRequest.value["playerName"];

//     if (!checkDataNotNull(confirmRequest)) {
//         showBox(warnCard, 2, {
//             type: "warn",
//             text: "请填写全部信息",
//         });
//     } else {
//         checkPlayerName(confirmRequest["playerName"]);
//     }
// }

</script>

<template>
    <InfoDialog :show="dialogData.display" :dialogType="dialogData.type" :dialogStyle="dialogData.style">
        <div style="line-height: 120px; font-size: 40px;" v-show="dialogData.stats === 0">加载中</div>
        <div v-show="dialogData.stats === 1">
            <div class="top">
                <img class="player-pic" :src="info.imgUrl" />
                <p class="player-name">Name: {{ info.name }}</p>
                <button class="minecraft-button button confirm-btn" type="button">
                    <RouterLink to="/">确认无误</RouterLink>
                </button>
            </div>
            <p class="bottom player-uuid">uuid: {{ info.uuid }}</p>
        </div>
        <div style="line-height: 120px; font-size: 40px;" v-show="dialogData.stats === 2">
            <p>查询错误!!!</p>
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
                    <input type="number" placeholder="对方的QQ号" v-model="guaranteeRequest.guaranteeQQ"
                        :class="{ 'input-red-color': warnCard.display }" />
                    <input type="number" placeholder="您的QQ号" v-model="guaranteeRequest.playerQQ"
                        :class="{ 'input-red-color': warnCard.display }" />
                    <input type="text" placeholder="您的游戏昵称" v-model="guaranteeRequest.playerName"
                        :class="{ 'input-red-color': warnCard.display }" />
                </div>
            </div>
            <div class="end">
                <button type="button" class="minecraft-button button">
                    <RouterLink to="/">返回</RouterLink>
                </button>
                <button type="button" class="minecraft-button button" @click="show()">
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