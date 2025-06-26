import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import {BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble} from 'react-icons/bs'

export default function FooterComp() {
    return (
    <>
<Footer container className='border border-t-8 border-teal-400 '>
        <div className='w-full max-w-7xl mx-auto '>
            <div className='grid w-full justify-between sm:flex md:grid-col-1'>
                <div>
                    <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span className='text-white px-2 py-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-500 rounded-lg'>
                            EchoNote
                        </span>
                    </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-8'>
                    <div>
                        <Footer.Title title='About' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='google.com'
                                target='_blank'
                                rel='noopenner noreferrer'
                            >
                                100 JS Projects
                            </Footer.Link>
                            <Footer.Link
                                href='google.com'
                                target='_blank'
                                rel='noopenner noreferrer'
                            >
                                Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Follow Us' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://github.com/Dev-639'
                                target='_blank'
                                rel='noopenner noreferrer'
                            >
                                GitHub
                            </Footer.Link>
                            <Footer.Link
                                href='instagram.com'
                                target='_blank'
                                rel='noopenner noreferrer'
                            >
                                Instagram
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Legal' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='google.com'
                                target='_blank'
                                rel='noopenner noreferrer'
                            >
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href='discord.com'
                                target='_blank'
                                rel='noopenner noreferrer'
                            >
                                Discord
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider/>
                <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright href='#' by="Dev's Blog" year={new Date().getFullYear()}/>
            <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href="#" icon={BsFacebook}/>
                    <Footer.Icon href="#" icon={BsInstagram}/>
                    <Footer.Icon href="#" icon={BsGithub}/>
                    <Footer.Icon href="#" icon={BsTwitter}/>
                    <Footer.Icon href="#" icon={BsDribbble}/>
                </div>
            </div>

        </div>
    </Footer>
    </>
    )
}
