import React from "react";
import grey_logo from "@/assets/icons/chat/grey_logo.png";
import heartIcon from "@/assets/icons/heart_white.svg";
import Image from "next/image";
import Link from "next/link";
import { getYear } from "date-fns";
import Button from "../button";

const SideBar = () => {
  const currentYear = getYear(new Date());
  return (
    <div className="sidebar-container">
      <div className="sidebar" >
        <div className="sidebar-inner">
          <div className="header">
            <h3>Chat Group</h3>
            <p className="chat-text">10/10</p>
          </div>

          {/* User list */}
          <ul>
            <li>
              <p className="chat-text">[Laura]</p>
            </li>
            <li className="active">
              <p className="chat-text">[Richard]</p>
              <div>*</div>
            </li>
            <li>
              <p className="chat-text">[Michael]</p>
            </li>
            <li>
              <p className="chat-text">[Joannah]</p>
            </li>
            <li>
              <p className="chat-text">[Nina]</p>
            </li>
            <li>
              <p className="chat-text">[Theresa]</p>
            </li>
            <li>
              <p className="chat-text">[Aron]</p>
            </li>
            <li>
              <p className="chat-text">[Catalina]</p>
            </li>
            <li>
              <p className="chat-text">[Robert]</p>
            </li>
            <li>
              <p className="chat-text">[Nicolas]</p>
            </li>
          </ul>

          {/* Advertisement section */}
          <div className="footer">
            <section className="ads">
              <p className="chat-text">Advertisement</p>
            </section>
            <div id="divider" />
            <section className="side-footer">
              <Image src={grey_logo} alt="Logo" />
              <div className="side-footer-links">
                <Link href="/about" target="_blank">
                  <p>About MessageMoment</p>
                </Link>
                <Link href="/faqs" target="_blank">
                  <p>FAQs</p>
                </Link>
                <Link href="/terms" target="_blank">
                  <p>Terms of Use</p>
                </Link>
                <Link href="/privacy" target="_blank">
                  <p>Privacy</p>
                </Link>
              </div>
              <div className="support-btn-chat">
                <Button
                  icon={heartIcon}
                  text="Support Us"
                  width={"190px"}
                  height={"36px"}
                  className="support-btn text-white secondary-bg"
                />
              </div>
              <h3 className="chat-text">
                Copyright © {currentYear} MessageMoment.
                <br /> All rights reserved.
              </h3>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
