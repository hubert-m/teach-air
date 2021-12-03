import React from 'react';
import {Twemoji} from "react-emoji-render";

function Footer() {
    return (
        <footer className="page-footer font-small">
            <div className="footer-copyright text-center"><Twemoji text={":D"} />&nbsp; Copyright © 2021&nbsp;|&nbsp;
                Projekt inżynierski&nbsp;
                <a href="https://machalahubert.pl/">Hubert Machała</a> made with <Twemoji text={":heart:"} />
            </div>
        </footer>
    )
}

export default Footer;