const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middlware");
const jwt = require("jsonwebtoken");
const { User } = require("../models");


//회원가입 API OK
router.post("/signup", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;
  const regNickname = /^[A-Za-z0-9]{3,}$/;
  const regPassword = /^.{4,}$/;
  try{
    if (!regNickname.test(nickname)){
      res.status(400).send({
        success: false,
        errorMessage: "닉네임 앙식이 맞지 않습니다.",
      });
      return;
    }
    else if (!regPassword.test(password) || password.search(nickname) > -1) {
      res.status(400).send({
        success: false,
        errorMessage: "비밀번호 양식이 맞지 않습니다.",
      });
      return;
    }
    else if (password !== confirmPassword) {
      res.status(400).send({
        success: false,
        errorMessage: "비밀번호와 비밀번호 확인 값이 일치하지 않습니다.",
      });
      return;
    }
    // nickname이 동일한게 이미 있으면 {}로 돌려준다. 없다면 null로
    const existsUsers = await User.findOne({ where:{ nickname}});
    if (existsUsers) {
      // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
      res.status(400).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
    const user = new User({ nickname, password });
    await user.save();
  
    //status 201 요청이 성공적이며 그결과 새로운 리소스가 생김을 의미함
    res.status(201).send({ user });
  } catch(err){
    res.status(401).send({
      errorMessage: "회원가입 오류",
    });
  }
});

//로그인 API OK
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  if(nickname === undefined && password === undefined){ 
    res.status(400).send({
      errorMessage: "닉네임, 패스워드 입력바랍니다.",
    });
    return;
  }
  const user = await User.findOne({where: {nickname, }});
  try{
     // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
    });
    return;
  }
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 60)

  const key = {userId: user.userId}
  const token = jwt.sign(key ,"customized-secret-key");
  res.cookie('token', token,{ expires: expires });
  res.send({token});
  } catch(err){
    res.status(401).send({
      errorMessage: "로그인 오류",
    });
  }
});

//사용자 인증 ok
router.get("/user", authorization, async (req, res) => {
  res.status(401).send({
    errorMessage: "이미 로그인되었습니다.",
  });
});
module.exports = router;
