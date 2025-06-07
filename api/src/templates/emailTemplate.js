export function generateOTPTemplate(code) {
  return `
    <p>Masukkan kode berikut untuk mereset password Anda:</p>
    <h2 style="color:tomato;">${code}</h2>
    <p>Kode ini berlaku 1 jam.</p>
  `;
}