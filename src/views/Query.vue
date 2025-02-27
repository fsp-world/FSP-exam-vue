<script setup>
import MCRouterLink from '@/components/MCRouterLink.vue';
</script>

<template>
  <div class="view-result">
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>查询结果</p>
      </div>
      <div class="main">
        <router-view />
      </div>
      <div class="end">
        <MCRouterLink to="/space" class="button">返回</MCRouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-result .main {
  background-color: rgba(0, 0, 0, 0.6);
  border-top: 3px solid #000;
  border-bottom: 3px solid #000;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  min-height: 760px;
}
.view-result .get-info {
  flex-basis: 0.2;
}

/* 结果页面 */
.view-result .main {
  justify-content: space-around;
  flex-direction: column;
  user-select: none;
}

.view-result .get-info div {
  width: 100%;
  display: flex;
  gap: 10px;

  .button {
    width: 50%;
    height: 70px;
    font-size: var(--button-font-size);
  }
}

.view-result .guarantee-result {
  .text {
    font-size: 30px;
    padding: 10px;
  }

  .tips {
    font-size: 26px;
    text-align: center;

    .server-url-list {
      padding: 10px;

      li {
        font-size: 25px;
        user-select: all;
        /* text-align: left; */
      }

      li:first-child {
        font-size: 30px;
        user-select: none;
      }
    }
  }
}

.view-result .show-score {
  width: 80%;

  .score {
    position: relative;
    top: -100px;

    > p {
      text-align: center;
      font-size: 40px;
      color: yellow;
      text-shadow:
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000;
      position: relative;
      bottom: 10px;
      z-index: 2;
    }

    .pass {
      width: 150px;
      height: 150px;
      background: url(../assets/images/vanilla_gui/accept.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      image-rendering: pixelated;
      position: absolute;
      right: 50px;
      bottom: -40px;
      animation: fadeIn 1s ease-in-out forwards;
    }

    .no-pass {
      width: 150px;
      height: 150px;
      background: url(../assets/images/vanilla_gui/reject.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      image-rendering: pixelated;
      position: absolute;
      right: 50px;
      bottom: -40px;
      animation: fadeIn 1s ease-in-out forwards;
    }

    .score-line {
      margin: 0 auto;
      border-radius: 5px;
      background-color: #000;
      width: 100%;
      height: 15px;
      position: relative;

      .end,
      .front {
        position: absolute;
        left: 0;
        top: 0px;
        width: 100%;
        height: 100%;
      }

      .end {
        background: url(../assets/images/vanilla_gui/experience_bar_background.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        image-rendering: pixelated;
      }

      .front {
        background: url(../assets/images/vanilla_gui/experience_bar_progress.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        image-rendering: pixelated;
        clip-path: inset(0 100% 0 0);
        animation: reveal 2s ease-in-out forwards;
      }
    }

    .text {
      animation: fadeIn 1s ease-in-out forwards;
      animation-delay: 2.5s;
      text-align: center;
      width: 60%;
      min-width: 450px;
      font-size: 25px;
      position: absolute;
      top: 100px;
      left: 50%;
      opacity: 0;
      transform: translate(-50%, 0);

      .server-url-list {
        padding: 10px;

        li {
          font-size: 25px;
          user-select: all;
          /* text-align: left; */
        }

        li:first-child {
          font-size: 30px;
          user-select: none;
        }
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
