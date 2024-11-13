import { Button } from '@/components/Button';

export function Vcf() {
  const handleOutputVcf = () => {
    const vcf: string = `BEGIN:VCARD
VERSION:3.0
N:Doe;John
FN:John Doe
ADR;TYPE=WORK:123 Main St, City, State, ZIP
TEL;TYPE=WORK:+1234567890
EMAIL;TYPE=INTERNET:john.doe@example.com
URL:https://example.com
END:VCARD`;

    downloadVcf(vcf);
  };

  const downloadVcf = (vcf: string) => {
    const nameMatch = vcf.match(/FN:(.*)/);
    const fullName = nameMatch ? nameMatch[1]?.trim() : 'contact';
    const fileName = `${fullName?.replace(/\s+/g, '_').toLowerCase()}.vcf`;
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p>Click the button below to download a sample vCard:</p>
      <Button onClick={handleOutputVcf}>Download vCard</Button>
    </div>
  );
}
