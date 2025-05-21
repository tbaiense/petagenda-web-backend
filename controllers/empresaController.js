const Empresa = require('../models/empresa');
const usuarioModel = require('../models/usuario');
const fs = require('node:fs/promises');
const appPath = require('../path');
const path = require('node:path');

exports.profile_pic = async function (req, res) {
    const caminhoFoto = path.join(appPath.PROFILE_PIC_DIR, `pic_emp_${req.params.idEmpresa}.jpg`);

    try {
        res.setHeader('Content-Type', 'image/jpeg');

        const imgBuffer = await fs.readFile(caminhoFoto);
        res.end(imgBuffer);
    } catch (err) {
        res.status(404).end();
    }
};

exports.list = function (req, res) {
    Empresa.find()
        .then( empresaList => {
            res.json(empresaList);
        });
}

exports.create = async function (req, res, next) {
    // criar objeto empresa

    /*
    foto: {
        type: "image/jpeg",
        data: BASE64
    }

    */
    const { razaoSocial, nomeFantasia, cnpj, lema, foto, endereco } = req.body;

    let novaEmpresa;
    try {
        novaEmpresa = new Empresa({
            razaoSocial,
            nomeFantasia,
            cnpj,
            lema,
            endereco
        });
    } catch (err) {
        next(new Error('Informações inválidas para criação de empresa: ' + err.message));
        return;
    }

    // salvar no banco
    const idEmpresa = await novaEmpresa.save();

    // Cadastrar foto
    if (foto && typeof foto == 'object') {
        if (foto.data && typeof foto.data == 'string') {
            let linkFoto = path.join(appPath.PROFILE_PIC_DIR, `pic_emp_${idEmpresa}.jpg`);
            let handle;
            try {
                handle = await fs.open(linkFoto, 'w');
                await handle.writeFile(foto.data, { encoding: 'base64' });

                // atualizar usuário com link da foto
                novaEmpresa.foto = `/empresa/${idEmpresa}/pic_emp_${idEmpresa}.jpg`;

                await novaEmpresa.save();
            } catch (err) {
                console.log('erro ao cadastrar foto: ', err.message);
            } finally {
                handle?.close();
            }

        }
    }

    // Se está utilizando token
    if (req.jwt) {
        // associar registro da empresa ao usuário
        usuarioModel.setEmpresa(idEmpresa, Number(req.jwt.payload.user))
            .then(() => {
                res.json({ id: idEmpresa });
            })
            .catch( err => {
                next(err);
            });
    } else {
        res.send();
    }

}
exports.info = function (req, res) {
    Empresa.find({id: req.params.idEmpresa})
        .then( found => {
            res.json({empresa: found[0]});
        }).catch( err => {
            next(err);
        });
}
exports.update = function (req, res) {
    res.send('empresa update work');
}
exports.delete = function (req, res) {
    res.send('empresa delete work');
}
