export async function getSkinBase64(PlayerName) {
  const playerInfoUrl = `https://playerdb.co/api/player/minecraft/${PlayerName}`;
  const response = await fetch(playerInfoUrl);
  const data = await response.json();
  const msg = data['message'];

  if (msg !== 'Successfully found player by given ID.') {
    return { state: false, msg: msg };
  }
  const skinBase64 = data['data']['player'].properties[0].value;
  return {
    state: true,
    uuid: data['data']['player']['id'],
    data: skinBase64,
  };
}

export async function getProfilePic(PlayerName) {
  const skinBase64 = await getSkinBase64(PlayerName);
  if (!skinBase64.state) {
    return { msg: skinBase64.msg };
  }
  try {
    // 解码 Base64 并解析 JSON
    const decoded = atob(skinBase64.data);
    const playerData = JSON.parse(decoded);

    // 获取皮肤 URL
    const skinUrl = playerData.textures.SKIN.url;

    // 获取皮肤图像
    const response = await fetch(skinUrl);
    const blob = await response.blob();
    const img = await createImageBitmap(blob);

    // 使用 Canvas 裁剪图像
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 8;
    canvas.height = 8;
    ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 8, 8);

    // const imgUrl = new Promise((resolve) => {
    //     canvas.toBlob((blob) => {
    //         const url = URL.createObjectURL(blob);
    //         resolve(url);
    //     }, "image/png");
    // });

    const imgData = canvas.toDataURL('image/png');

    return { msg: 'ok', uuid: skinBase64.uuid, imgUrl: imgData };
  } catch (error) {
    console.error('图像解码失败:', error);
  }
}
