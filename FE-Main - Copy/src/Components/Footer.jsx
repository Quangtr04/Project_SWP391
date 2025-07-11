import React from "react";
import { HeartIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <HeartIcon className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">SchoolHealth</span>
            </div>
            <p className="text-gray-300 mb-4">
              Hệ thống quản lý y tế học đường toàn diện, giúp nhà trường và phụ
              huynh chăm sóc sức khỏe học sinh một cách hiệu quả và chuyên
              nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/#documents-section"
                  className="text-gray-300 hover:text-white"
                >
                  Tài liệu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#blog-section"
                  className="text-gray-300 hover:text-white"
                >
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#documents-section"
                  className="text-gray-300 hover:text-white"
                >
                  Hỗ trợ
                </NavLink>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-300">support@schoolhealth.vn</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-300">1900 1234</span>
              </li>
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 SchoolHealth. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
