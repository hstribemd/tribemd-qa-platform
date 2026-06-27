import nspell from 'nspell';
import ptBr from 'dictionary-pt-br';
import { promisify } from 'node:util';

const load = promisify(ptBr);
const dict = await load();              // { aff: Buffer, dic: Buffer }
const spell = nspell(dict);

const realText = "Conectamos, criamos e disseminamos conteúdo. Oncologia Brasil. Hematologia. ESMO ASCO BCRI NetMD Cardiologia";
const typoText = "Conequitado ao invés de conectado. Notícais em alta. Eventoss recentes.";

const tokenize = (t) => t.match(/[A-Za-zÀ-ÿ]{2,}/g) || [];
const check = (label, text) => {
  const bad = tokenize(text).filter(w => !spell.correct(w));
  console.log(`\n[${label}]`);
  if (!bad.length) console.log('  (nenhuma suspeita)');
  bad.forEach(w => console.log('  suspeita:', w, '-> sugestões:', spell.suggest(w).slice(0,3)));
};
check('TEXTO REAL DO TRIBEMD', realText);
check('TEXTO COM ERRO', typoText);
