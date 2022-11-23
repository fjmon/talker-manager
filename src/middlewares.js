const crypto = require('crypto');

function generateToken() {
    return crypto.randomBytes(8).toString('hex');
}
function validacao(req, res, next) {
    const { email, password } = req.body;
    const emailVal = /\S+@\S+\.\S+/;

    if (!email) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (!emailVal.test(email)) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (!password) {
        return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }

    return next();
}



function validaAutoriza(req, res, next) {
    const { name } = req.body;
    const { authorization } = req.headers;

    if (!name) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "name" é obrigatório' });
    if (name.length < 3) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    if (!authorization) return res.status(HTTP_UNAUTHORIZED_STATUS)
        .json({ message: 'Token não encontrado' });
    if (authorization.length < 16) return res.status(HTTP_UNAUTHORIZED_STATUS)
        .json({ message: 'Token inválido' });

    return next();
};

function validaIdade(req, res, next) {
    const { age } = req.body;

    if (!age) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "age" é obrigatório' });
    if (Number(age) < 18) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'A pessoa palestrante deve ser maior de idade' });

    return next();
};

function validaTalk(req, res, next) {
    const { talk } = req.body;
    if (!talk) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "talk" é obrigatório' });

    return next();
};

function validaWatchedAt(req, res, next) {
    const { talk: { watchedAt } } = req.body;
    const dataReg = /(\d{2})\/?(\d{2})?\/(\d{4})/;
    if (!watchedAt) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "watchedAt" é obrigatório' });
    if (!dataReg.test(watchedAt)) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });

    return next();
};

function validaTalk2(req, res, next) {
    const { talk: { rate } } = req.body;
    const rateReg = /^-?[0-9]+$/;

    if (!rate) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "rate" é obrigatório' });
    if (Number(rate) < 1 || Number(rate) > 5 || !rateReg.test(Number(rate))) return res.status(HTTP_ERRO_STATUS)
        .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });

    return next();
};

module.exports = {
    generateToken,
    validacao,
    validaAutoriza,
    validaIdade,
    validaTalk,
    validaTalk2,
    validaWatchedAt,
};
