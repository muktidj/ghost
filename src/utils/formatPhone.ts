export const formatPhone = (phone: string) => {
  let formatted = phone.replace(/\D/g, '');

  if (formatted.startsWith('0') || formatted.startsWith('+62')) {
    formatted = `62${formatted.substr(1)}`;
  } else if (formatted.startsWith('8')) {
    formatted = `62${formatted}`;
  }

  return formatted;
};
