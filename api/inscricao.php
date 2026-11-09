<?php
/* ============================================================
   Oeiras Valley Padel Corporate Cup 2027 · receção de inscrições
   Recebe a ficha (JSON) enviada por inscricoes.html e:
     1. gera um registo CSV (1 linha por jogador);
     2. envia o CSV em anexo para a organização;
     3. envia um email de receção ao ponto de contacto da empresa.
   Requisitos: alojamento com PHP 7.4+ e envio de email (função mail).

   CONFIGURAÇÃO: rever as 3 constantes abaixo antes de publicar.
   ============================================================ */
declare(strict_types=1);

const DESTINO        = 'geral@human-iq.pt';                 // quem recebe o CSV
const REMETENTE      = 'inscricoes@SEU-DOMINIO.pt';          // caixa do domínio onde o site está alojado
const NOME_REMETENTE = 'Oeiras Valley Padel Corporate Cup';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function sair(int $codigo, array $corpo): void {
    http_response_code($codigo);
    echo json_encode($corpo, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') sair(405, ['ok' => false, 'erro' => 'Método não permitido.']);

/* só aceita pedidos feitos a partir do próprio site */
$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origem !== '' && parse_url($origem, PHP_URL_HOST) !== preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '')) {
    sair(403, ['ok' => false, 'erro' => 'Origem não autorizada.']);
}

/* limite simples: 5 envios por endereço IP em cada 10 minutos */
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
$marca = sys_get_temp_dir() . '/ovpcc_' . hash('sha256', $ip);
$agora = time();
$envios = is_file($marca) ? array_filter(array_map('intval', explode(',', (string) @file_get_contents($marca))), fn($t) => $t > $agora - 600) : [];
if (count($envios) >= 5) sair(429, ['ok' => false, 'erro' => 'Demasiados envios. Tente dentro de alguns minutos.']);

$bruto = file_get_contents('php://input', false, null, 0, 200001);
if ($bruto === false || strlen($bruto) > 200000) sair(413, ['ok' => false, 'erro' => 'Ficha demasiado grande.']);
$d = json_decode($bruto, true);
if (!is_array($d)) sair(400, ['ok' => false, 'erro' => 'Ficha ilegível.']);

/* ---------- limpeza e validação ---------- */
function txt($v, int $max = 200): string {
    if (is_bool($v)) return $v ? 'Sim' : 'Não';
    if (!is_scalar($v)) return '';
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string) $v) ?? '';
    return mb_substr(trim($s), 0, $max, 'UTF-8');
}
function email_ok(string $e): bool {
    return $e !== '' && strlen($e) <= 254 && filter_var($e, FILTER_VALIDATE_EMAIL) !== false;
}

$ref = txt($d['referencia'] ?? '', 30);
if (!preg_match('/^OVPCC27-[A-Z0-9]{4,12}$/', $ref)) sair(400, ['ok' => false, 'erro' => 'Referência inválida.']);

$emp = is_array($d['empresa'] ?? null) ? $d['empresa'] : [];
$ct  = is_array($d['contacto'] ?? null) ? $d['contacto'] : [];
$fat = is_array($d['faturacao'] ?? null) ? $d['faturacao'] : [];
$equipas = is_array($d['equipas'] ?? null) ? array_values($d['equipas']) : [];
$eventos = is_array($d['eventos'] ?? null) ? array_map(fn($e) => txt($e, 60), array_slice($d['eventos'], 0, 3)) : [];
$mkt = !empty($d['declaracoes']['marketingParceiros']);

$emailContacto = strtolower(txt($ct['email'] ?? '', 254));
if (txt($emp['nome'] ?? '') === '' || !preg_match('/^\d{9}$/', txt($emp['nif'] ?? ''))) sair(400, ['ok' => false, 'erro' => 'Dados da empresa em falta.']);
if (!email_ok($emailContacto)) sair(400, ['ok' => false, 'erro' => 'Email do ponto de contacto inválido.']);
if (!$eventos) sair(400, ['ok' => false, 'erro' => 'Falta escolher o evento.']);
if (count($equipas) < 1 || count($equipas) > 27) sair(400, ['ok' => false, 'erro' => 'Número de duplas inválido.']);
foreach ($equipas as $t) {
    if (!is_array($t) || !is_array($t['jogadores'] ?? null) || count($t['jogadores']) !== 2) sair(400, ['ok' => false, 'erro' => 'Cada dupla tem de ter 2 jogadores.']);
}

/* ---------- CSV: 1 linha por jogador, separador ";" (abre diretamente no Excel) ---------- */
function celula(string $v): string {
    if ($v !== '' && strpbrk($v[0], "=+-@\t") !== false) $v = "'" . $v;   // impede fórmulas ao abrir no Excel
    return '"' . str_replace('"', '""', $v) . '"';
}
$cab = ['referencia', 'data', 'eventos', 'empresa', 'nif', 'ligacao_oeiras', 'morada', 'codigo_postal', 'localidade', 'parque', 'setor', 'colaboradores',
        'contacto', 'cargo_contacto', 'telefone_contacto', 'email_contacto', 'fat_entidade', 'fat_nif', 'fat_morada', 'fat_email',
        'dupla', 'quadro', 'nivel', 'capitao', 'jogador', 'nome', 'sexo', 'federado', 'nivel_fpp', 'licenca_fpp', 'vinculo', 'cargo', 'profissao',
        'email', 'telemovel', 'camisola', 'maior_18', 'marketing_parceiros'];
$linhas = [$cab];
$base = [$ref, txt($d['criadoEm'] ?? date('c'), 40), implode(' + ', $eventos),
         txt($emp['nome'] ?? ''), txt($emp['nif'] ?? '', 9), txt($emp['ligacaoOeiras'] ?? ''), txt($emp['morada'] ?? ''), txt($emp['codigoPostal'] ?? '', 8),
         txt($emp['localidade'] ?? ''), txt($emp['parque'] ?? ''), txt($emp['setor'] ?? ''), txt($emp['colaboradores'] ?? ''),
         txt($ct['nome'] ?? ''), txt($ct['cargo'] ?? ''), txt($ct['telefone'] ?? '', 30), $emailContacto,
         txt($fat['entidade'] ?? ''), txt($fat['nif'] ?? '', 9), txt($fat['morada'] ?? '', 300), txt($fat['email'] ?? '', 254)];
$resumo = [];
foreach ($equipas as $i => $t) {
    $resumo[] = sprintf('Dupla %d: %s · %s · %s', $i + 1, txt($t['nome'] ?? ''), txt($t['quadro'] ?? ''), txt($t['nivel'] ?? ''));
    foreach (array_values($t['jogadores']) as $k => $p) {
        if (!is_array($p)) $p = [];
        $linhas[] = array_merge($base, [
            txt($t['nome'] ?? ''), txt($t['quadro'] ?? '', 20), txt($t['nivel'] ?? '', 20), txt($t['capitao'] ?? '', 2), (string) ($k + 1),
            txt($p['nome'] ?? ''), txt($p['sexo'] ?? '', 20), txt($p['federado'] ?? '', 5), txt($p['nivelFPP'] ?? '', 2), txt($p['licencaFPP'] ?? '', 30),
            txt($p['vinculo'] ?? ''), txt($p['cargo'] ?? ''), txt($p['profissao'] ?? ''), strtolower(txt($p['email'] ?? '', 254)),
            txt($p['telemovel'] ?? '', 30), txt($p['camisola'] ?? '', 5), txt($p['maior18'] ?? false), $mkt ? 'Sim' : 'Não',
        ]);
        $resumo[] = sprintf('   Jogador %d: %s', $k + 1, txt($p['nome'] ?? ''));
    }
}
$csv = "\xEF\xBB\xBF" . implode("\r\n", array_map(fn($l) => implode(';', array_map('celula', $l)), $linhas)) . "\r\n";

/* ---------- emails ---------- */
function cabecalho(string $s): string { return mb_encode_mimeheader($s, 'UTF-8', 'B', "\r\n"); }
$de = cabecalho(NOME_REMETENTE) . ' <' . REMETENTE . '>';
$nInsc = count($equipas) * count($eventos);
$corpoResumo = "Referência: $ref\r\nEmpresa: " . txt($emp['nome'] ?? '') . ' (NIF ' . txt($emp['nif'] ?? '', 9) . ")\r\n"
    . 'Parque: ' . txt($emp['parque'] ?? '') . "\r\n"
    . 'Contacto: ' . txt($ct['nome'] ?? '') . ' · ' . txt($ct['telefone'] ?? '', 30) . " · $emailContacto\r\n"
    . 'Eventos: ' . implode(' e ', $eventos) . "\r\n\r\n" . implode("\r\n", $resumo) . "\r\n\r\n"
    . 'Total: ' . count($equipas) . ' duplas x ' . count($eventos) . " eventos = $nInsc inscrições\r\n";

/* 1. organização: resumo + CSV em anexo */
$lim = 'ovpcc-' . bin2hex(random_bytes(12));
$msgOrg = "--$lim\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode("Nova inscrição recebida pelo site.\r\n\r\n" . $corpoResumo . "\r\nO registo completo segue em anexo (CSV).\r\n"))
    . "--$lim\r\nContent-Type: text/csv; charset=UTF-8; name=\"$ref.csv\"\r\nContent-Transfer-Encoding: base64\r\n"
    . "Content-Disposition: attachment; filename=\"$ref.csv\"\r\n\r\n" . chunk_split(base64_encode($csv)) . "--$lim--\r\n";
$cabOrg = "From: $de\r\nReply-To: $emailContacto\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$lim\"";
$okOrg = @mail(DESTINO, cabecalho('Inscrição ' . $ref . ' · ' . txt($emp['nome'] ?? '', 80)), $msgOrg, $cabOrg, '-f' . REMETENTE);
if (!$okOrg) sair(500, ['ok' => false, 'erro' => 'Não foi possível enviar a ficha. Tente de novo ou contacte ' . DESTINO . '.']);

/* 2. autor da inscrição: email de receção */
$msgAutor = 'Olá ' . txt($ct['nome'] ?? '') . ",\r\n\r\n"
    . "Recebemos a ficha de inscrição da sua empresa na Oeiras Valley Padel Corporate Cup 2027. A submissão foi bem sucedida.\r\n\r\n"
    . $corpoResumo . "\r\n"
    . "Este email confirma a receção da ficha. A inscrição fica válida depois da confirmação da HUMAN-IQ Padel Experiences e do pagamento.\r\n\r\n"
    . 'Para corrigir algum dado, responda a este email e indique a referência ' . $ref . ".\r\n\r\n"
    . "A organização\r\nOeiras Valley Padel Corporate Cup 2027\r\n" . DESTINO . "\r\n";
$cabAutor = "From: $de\r\nReply-To: " . DESTINO . "\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64";
$okAutor = @mail($emailContacto, cabecalho('Recebemos a sua inscrição · ' . $ref), chunk_split(base64_encode($msgAutor)), $cabAutor, '-f' . REMETENTE);

$envios[] = $agora;
@file_put_contents($marca, implode(',', $envios), LOCK_EX);

sair(200, ['ok' => true, 'referencia' => $ref, 'confirmacao' => (bool) $okAutor]);
