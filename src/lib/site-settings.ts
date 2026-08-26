export interface SiteSettings {
  addressLine1: string;
  addressLine2: string;
  gpsAddress: string;
  phone1: string;
  phone2: string;
  whatsapp1: string;
  whatsapp2: string;
  email: string;
  officeHoursWeekdays: string;
  officeHoursSaturday: string;
  officeHoursSunday: string;
  mapEmbedUrl: string;
}

export const defaultSiteSettings: SiteSettings = {
  addressLine1: "House Number T, 26B SSNIT ST",
  addressLine2: "Anaji Takoradi - Ghana",
  gpsAddress: "WK-391-2390",
  phone1: "+233 59 816 4027",
  phone2: "+233 20 236 1616",
  whatsapp1: "+233 24 489 3605",
  whatsapp2: "+1 240 475 6569",
  email: "pdanmes@gmail.com",
  officeHoursWeekdays: "Monday – Friday: 8:00 AM – 6:00 PM",
  officeHoursSaturday: "Saturday: 9:00 AM – 3:00 PM",
  officeHoursSunday: "Sunday: Closed",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-1.7466!3d4.9045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNTQnMTYuMiJOIDHCsDQ0JzQ3LjgiVw!5e0!3m2!1sen!2sgh!4v1",
};

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string, message?: string) {
  const number = phone.replace(/\D/g, "");
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
