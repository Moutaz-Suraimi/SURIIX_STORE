import PageTemplate from './PageTemplate';

export default function GettingStarted() {
  return (
    <PageTemplate title="دليل البدء">
      <p>أهلاً بك في سريكس! دعنا نبدأ خطوة بخطوة لبناء متجرك.</p>
      <ol>
        <li>أنشئ حسابك.</li>
        <li>أدخل تفاصيل متجرك.</li>
        <li>أضف أول منتج لك وانطلق!</li>
      </ol>
    </PageTemplate>
  );
}
