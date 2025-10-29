import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('audio') as unknown as File;
    const pages = data.get('pages') as string || '1';
    const notes = data.get('notes') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Неверный тип файла' }, { status: 400 });
    }

    try {
      const healthCheck = await fetch(`${BACKEND_URL}/`, {
        method: 'GET'
      });
      if (!healthCheck.ok) {
        throw new Error(`Backend недоступен: ${healthCheck.status}`);
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Бэкенд недоступен. Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },
        { status: 503 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('pages', pages);
    backendFormData.append('notes', notes);

    const backendResponse = await fetch(`${BACKEND_URL}/audio`, {
      method: 'POST',
      body: backendFormData
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: `Backend error: ${backendResponse.status} - ${errorText}` },
        { status: backendResponse.status }
      );
    }

    const pdfBuffer = await backendResponse.arrayBuffer();
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
    return NextResponse.json(
      { error: `Ошибка при обработке аудио: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },
      { status: 500 }
    );
  }
}
