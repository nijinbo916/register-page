/* ============================================================
   用户注册页交互脚本
   Web 开发技术 · Lesson 1 课后作业
   功能：1.字段校验  2.密码强度  3.显示/隐藏密码
        4.提交处理  5.提示条 Toast
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM 引用 ---------- */
  var form = document.getElementById('registerForm');
  var submitBtn = document.getElementById('submitBtn');
  var strengthBox = document.getElementById('strengthBox');
  var strengthText = document.getElementById('strengthText');
  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toastText');

  var el = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    agree: document.getElementById('agree')
  };

  /* ============================================================
     校验规则表
     每个字段一条规则：test() 返回 true 表示通过，
     不通过时返回错误提示文案（字符串）。
     ============================================================ */
  var RULES = {
    username: function (value) {
      if (!value) return '请输入用户名';
      if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
        return '用户名需为 4-16 位字母、数字或下划线';
      }
      return true;
    },

    email: function (value) {
      if (!value) return '请输入邮箱';
      if (!/^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/.test(value)) {
        return '邮箱格式不正确，例如 name@example.com';
      }
      return true;
    },

    phone: function (value) {
      if (!value) return '请输入手机号';
      if (!/^1[3-9]\d{9}$/.test(value)) {
        return '请输入 11 位有效的中国大陆手机号';
      }
      return true;
    },

    password: function (value) {
      if (!value) return '请输入密码';
      if (value.length < 8) return '密码长度至少 8 位';
      if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
        return '密码需同时包含字母和数字';
      }
      if (!/^[\x21-\x7e]+$/.test(value)) {
        return '密码暂不支持空格或中文字符';
      }
      return true;
    },

    confirmPassword: function (value) {
      if (!value) return '请再次输入密码';
      if (value !== el.password.value) return '两次输入的密码不一致';
      return true;
    },

    agree: function (_, input) {
      if (!input.checked) return '请先阅读并同意用户协议';
      return true;
    }
  };

  /* ---------- 工具：拿到字段所在的 .form-item ---------- */
  function getItem(name) {
    return document.querySelector('.form-item[data-field="' + name + '"]');
  }

  /* ---------- 工具：写提示并切换状态样式 ---------- */
  function setState(name, result) {
    var item = getItem(name);
    if (!item) return result === true;

    var tip = item.querySelector('.form-tip');
    var ok = result === true;

    // 先清掉旧状态，再按结果打上新状态
    item.classList.remove('is-error', 'is-ok');
    item.classList.add(ok ? 'is-ok' : 'is-error');

    if (tip) tip.textContent = ok ? '' : result;
    return ok;
  }

  /* ---------- 校验单个字段 ---------- */
  function validateField(name, silent) {
    var input = el[name];
    if (!input) return true;

    var result = RULES[name](input.value.trim(), input);

    // silent = true 时只算结果、不写样式（用于提交前统一检查）
    if (silent) return result === true;
    return setState(name, result);
  }

  /* ---------- 校验全部字段 ---------- */
  function validateAll() {
    var names = Object.keys(RULES);
    var firstInvalid = null;

    names.forEach(function (name) {
      if (!validateField(name)) {
        if (!firstInvalid) firstInvalid = name;
      }
    });

    // 滚动并聚焦到第一个出错的字段
    if (firstInvalid) {
      var input = el[firstInvalid];
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return !firstInvalid;
  }

  /* ============================================================
     密码强度：按字符种类与长度综合打分，共 4 级
     ============================================================ */
  function getStrength(pwd) {
    if (!pwd) return 0;

    var score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;      // 同时含大小写
    if (/\d/.test(pwd)) score++;
    if (/[^\w\s]/.test(pwd)) score++;                          // 含特殊符号

    // 太短或过于单一，直接压低等级
    if (pwd.length < 6 || /^(.)\1+$/.test(pwd)) score = 1;

    return Math.min(4, Math.max(1, Math.ceil(score * 4 / 6)));
  }

  var STRENGTH_LABEL = ['', '弱', '一般', '较强', '很强'];

  function renderStrength() {
    var pwd = el.password.value;
    var level = pwd ? getStrength(pwd) : 0;

    strengthBox.hidden = !pwd;
    strengthBox.dataset.level = String(level);
    strengthText.textContent = pwd ? STRENGTH_LABEL[level] : '密码强度';
  }

  /* ============================================================
     显示 / 隐藏密码
     ============================================================ */
  Array.prototype.forEach.call(document.querySelectorAll('.toggle-pwd'), function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.dataset.target);
      var toText = input.type === 'password';

      input.type = toText ? 'text' : 'password';
      btn.classList.toggle('is-on', toText);
      btn.setAttribute('aria-label', toText ? '隐藏密码' : '显示密码');
      input.focus({ preventScroll: true });
    });
  });

  /* ============================================================
     事件绑定：失焦时校验，输入时清理错误态
     ============================================================ */
  Object.keys(RULES).forEach(function (name) {
    var input = el[name];
    if (!input) return;

    // 失焦校验（复选框改为点击即校验）
    var evt = name === 'agree' ? 'change' : 'blur';
    input.addEventListener(evt, function () {
      validateField(name);
    });

    // 输入过程中：一旦已出错，就实时重算，达标即消除红框
    if (name !== 'agree') {
      input.addEventListener('input', function () {
        var item = getItem(name);
        if (item && item.classList.contains('is-error')) {
          validateField(name);
        }
      });
    }
  });

  // 密码变化时同步刷新强度条与确认密码的一致性
  el.password.addEventListener('input', function () {
    renderStrength();
    if (el.confirmPassword.value) validateField('confirmPassword');
  });

  /* ============================================================
     提交处理
     ============================================================ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();                 // 前端演示项目，阻止默认提交

    if (!validateAll()) {
      showToast('请检查表单中标红的内容', true);
      return;
    }

    // 通过校验：进入加载态，模拟一次异步提交
    submitBtn.classList.add('is-loading');

    window.setTimeout(function () {
      submitBtn.classList.remove('is-loading');
      showToast('注册成功，欢迎加入 ' + el.username.value.trim() + '！');

      form.reset();
      renderStrength();
      // 重置后清掉所有校验样式
      Array.prototype.forEach.call(form.querySelectorAll('.form-item'), function (item) {
        item.classList.remove('is-error', 'is-ok');
        var tip = item.querySelector('.form-tip');
        if (tip) tip.textContent = '';
      });
    }, 900);
  });

  /* ============================================================
     Toast 提示条
     ============================================================ */
  var toastTimer = null;

  function showToast(message, isError) {
    toastText.textContent = message;
    toast.classList.toggle('is-error', !!isError);
    toast.classList.add('is-show');

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-show');
    }, 2600);
  }

  /* ---------- 初始化 ---------- */
  renderStrength();
})();
