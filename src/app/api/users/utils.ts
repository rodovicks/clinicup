export async function handleFormData(request: Request) {
  const formData = await request.formData();

  const photo = formData.get('photo') as File | null;
  const userData = formData.get('userData');

  if (typeof userData !== 'string') {
    throw new Error('Invalid user data format');
  }

  const parsed = JSON.parse(userData);

  const apiFormData = new FormData();

  if (photo && photo.size > 0) {
    apiFormData.append('file', photo);
  }

  Object.entries(parsed).forEach(([key, value]) => {
    apiFormData.append(key, String(value));
  });

  return { apiFormData };
}
