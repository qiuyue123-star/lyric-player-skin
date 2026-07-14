const storage = chrome.storage.local;
const switchDom = document.getElementById("effectSwitch");
const radioList = document.querySelectorAll('input[name="effectType"]');
const saveBtn = document.getElementById("saveConfigBtn");
const statusTip = document.getElementById("statusTip");

// 初始化读取本地配置
async function initConfig() {
  const res = await storage.get(["clickEffectSwitch", "activeEffect"]);
  // 渲染总开关
  switchDom.checked = res.clickEffectSwitch ?? false;
  // 渲染选中的特效
  const targetRadio = Array.from(radioList).find(item => item.value === res.activeEffect);
  if (targetRadio) targetRadio.checked = true;
  // 清空提示文字
  statusTip.textContent = "";
}

// 点击保存按钮执行配置保存
saveBtn.addEventListener("click", async () => {
  // 第一步：提示 正在配置……
  statusTip.className = "status-tip status-wait";
  statusTip.textContent = "正在配置……";
  saveBtn.disabled = true;

  // 获取当前面板选中值
  const switchValue = switchDom.checked;
  let selectedEffect = "";
  radioList.forEach(radio => {
    if (radio.checked) selectedEffect = radio.value;
  });

  try {
    await storage.set({
      clickEffectSwitch: switchValue,
      activeEffect: selectedEffect
    });
    // 成功提示
    statusTip.className = "status-tip status-success";
    statusTip.textContent = "配置成功！已成功应用，需要刷新页面即可生效。";
  } catch (err) {
    console.error("保存配置异常：", err);
    statusTip.className = "status-tip";
    statusTip.style.color = "#ff8888";
    statusTip.textContent = "配置失败，请重试！";
  } finally {
    saveBtn.disabled = false;
  }
});

// 页面加载执行初始化
initConfig();
