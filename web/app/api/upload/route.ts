import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    console.log('Получен запрос на загрузку аудио');

    const data = await request.formData();
    const file: File | null = data.get('audio') as unknown as File;

    console.log('Файл получен:', file ? `${file.name} (${file.size} bytes)` : 'null');

    if (!file) {
      console.log('Ошибка: файл не найден');
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    if (!file.type.startsWith('audio/')) {
      console.log('Ошибка: неверный тип файла:', file.type);
      return NextResponse.json({ error: 'Неверный тип файла' }, { status: 400 });
    }

    console.log('Отправка файла на бэкенд:', BACKEND_URL);

    try {
      const healthCheck = await fetch(`${BACKEND_URL}/`, {
        method: 'GET'
      });
      console.log('Health check response:', healthCheck.status);
      if (!healthCheck.ok) {
        throw new Error(`Backend недоступен: ${healthCheck.status}`);
      }
      console.log('Бэкенд доступен');
    } catch (error) {
      console.error('Ошибка подключения к бэкенду:', error);
      return NextResponse.json(
        { error: `Бэкенд недоступен. Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },
        { status: 503 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendResponse = await fetch(`${BACKEND_URL}/audio`, {
      method: 'POST',
      body: backendFormData
    });

    console.log('Ответ бэкенда:', backendResponse.status, backendResponse.statusText);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Ошибка бэкенда:', errorText);
      return NextResponse.json(
        { error: `Backend error: ${backendResponse.status} - ${errorText}` },
        { status: backendResponse.status }
      );
    }

    const pdfBuffer = await backendResponse.arrayBuffer();
    console.log('PDF получен, размер:', pdfBuffer.byteLength, 'bytes');

    const base64PDF = Buffer.from(pdfBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      type: file.type,
      pdfData: base64PDF,
      message: 'Аудио успешно обработано и конвертировано в PDF'
    });

  } catch (error) {
    console.error('Ошибка при обработке аудио:', error);
    return NextResponse.json(
      { error: `Ошибка при обработке аудио: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },
      { status: 500 }
    );
  }
}
