import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from 'pancakeswap-uikit'
import logo from '../../images/logo.png'
import logo1 from '../../images/1.png'
import logo2 from '../../images/2.png'
import logo3 from '../../images/3.png'
import logo4 from '../../images/4.png'
import './footer.css'

const FooterWrap = styled.div`
  img {
    width: 100%;
    height: 100%;
  }
  .footer-wrap {
    position: relative;
  }
  .footer-logo {
    position: absolute;
    width: calc(30% - 100px);
    top: 0px;
    left: 60px;
    div {
      margin: auto;
      width: 54px;
      height: 50px;
    }
  }
  .footer-header {
    position: absolute;
    left: 60px;
    top: 80px;
    width: calc(30% - 100px);
    .f-h-text {
      width: 100%;
      word-wrap: break-word;
    }
    .image-list {
      margin-top: 30px;
      padding: 0px 20px;
      div {
        width: 33px;
        height: 33px;
        img {
          color: black;
          filter: brightness(0);
        }
      }
    }
  }
  .footer-main {
    width: 100%;
    padding-left: calc(30%);
  }
`
const Ptag = styled.p`
  word-wrap: break-ward;
  text-align: left;
  color: white;
  font-size 16px;
  line-height: 23px;
  font-weight: 300; 
`
export default function Footer() {
  return (
    <footer className="footer-container">
      <FooterWrap className="footer-wrap">
        <Flex className="footer-logo">
          <div>
            <img src={logo} alt="logo" />
          </div>
        </Flex>
        <Flex className="footer-header" flexDirection="column" justifyContent="space-around">
          <Ptag className="f-h-text">
            Omnidex is building a comprehensive decentralized trading platform on the Telos Blockchain. Join the
            community today!
          </Ptag>
          <Flex className="image-list" justifyContent="space-around">
            <div>
              <Link href="discord">
                <img src={logo1} alt=" " />
              </Link>
            </div>
            <div>
              <Link href="ddd">
                <img src={logo2} alt=" " />
              </Link>
            </div>
            <div>
              <Link href="ddd">
                <img src={logo3} alt=" " />
              </Link>
            </div>
            <div>
              <Link href="dd">
                <img src={logo4} alt=" " />
              </Link>
            </div>
          </Flex>
        </Flex>

        <Flex className="footer-main" flexDirection="row" justifyContent="space-around">
          <Flex flexDirection="column">
            <Text className="f-m-title">OmniDex</Text>
            <Link href="/1">News & Updates</Link>
            <Link href="/1">Documentation</Link>
            <Link href="/1">Tokenomics</Link>
            <Link href="/1">FAQs</Link>
          </Flex>
          <Flex flexDirection="column">
            <Text className="f-m-title">Resources</Text>
            <Link href="/1">Bridge to Telos</Link>
            <Link href="/1">Block Explorer</Link>
            <Link href="/1">Create a Pair</Link>
          </Flex>
          <Flex flexDirection="column">
            <Text className="f-m-title">Roundation</Text>
            <Link href="/1">Hiring</Link>
            <Link href="/1">Github</Link>
            <Link href="/1">Apply for a Farm</Link>
          </Flex>
        </Flex>
      </FooterWrap>
    </footer>
  )
}
