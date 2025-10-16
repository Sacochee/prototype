import Image from 'next/image'
import React from 'react'
import style from './page.module.css'
import Link from 'next/link'
import ButtonLink from '@/comps/buttonLink/ButtonLink'
import LoadingIco from '@/comps/loading/LoadingIco'
import ButtonLinkLoading from '@/comps/buttonLink/ButtonLinkLoading'

export default function page() {
  return (
    <main className={style.main}>
      <header>
        <Image
          src={"/Logo_Dark.svg"}
          width={512}
          height={98}
          alt=''
        />
        <span>PROTOTYPE</span>
      </header>
      {/* add le ::after. */}
      <div className={style.button}>
        <ButtonLinkLoading path='editor' >LANCER LE PROTOTYPE</ButtonLinkLoading>
        <span>Désolé, mais seul un ordinateur peut accéder au prototype</span>
      </div>

      <Link href={"/instructions"}>ACCEDER AUX INSTRUCTIONS</Link>

      <article>
        <div><h2>
          LE PROTOTYPE
        </h2>
          <p>
            Cette version est un prototype. Pour en comprendre le fonctionnement, il est primordial de consulter d’abord la rubrique <strong>INSTRUCTIONS</strong>.
          </p>
          <p>
            À noter qu’un prototype est une version de test et <strong>non une version stable</strong>, ce qui signifie que des bugs peuvent survenir. Merci de votre compréhension.
          </p></div>

        <Image
          width={200}
          height={200}
          alt=''
          src={"/engrenage.gif"}
        />
      </article>



      <article>
        <Image
          width={200}
          height={200}
          alt=''
          src={"/instructions.gif"}
        />
        <div>
          <h2 style={{ textAlign: 'end' }}>
            LES INSTRUCTIONS
          </h2>
          <p>
            Ce <strong>prototype</strong> n’est pas complètement terminé, c’est pourquoi l’interface n’est pas toujours intuitive. Pour une meilleure expérience, il est recommandé de <strong>consulter les instructions d’utilisation</strong> avant toute utilisation.
          </p>
          <div className={style.container} style={{ justifyContent: 'center' }}>
            <ButtonLink path='instructions'>
              ACCEDER AUX INSTRUCTIONS
              <svg height="15px" width="15px" version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" >
                <g>
                  <g>
                    <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 		" />
                  </g>
                </g>
              </svg>
            </ButtonLink >
          </div>

        </div>
      </article>

      <article>
        <div><h2>
          LE FEEDBACK
        </h2>
          <p>
            Pour un développeur, <strong>le feedback est primordial</strong>, car il permet d’adapter le projet aux utilisateurs. C’est pourquoi, si vous rencontrez de <strong>mauvaises</strong> ou de <strong>bonnes expériences</strong> lors de l’utilisation de ce prototype, n’hésitez pas à nous faire part de vos ressentis. Toute <strong>remarque constructive</strong> est la bienvenue, sentez-vous libre de la partager.
          </p>
          <div className={style.container}>
            <ButtonLink path='mailto:sacha.duprat81@gmail.com' blank>
              ENVOYER UN FEEDBACK
              <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.265 4.42619C1.04293 2.87167 2.6169 1.67931 4.05323 2.31397L21.8341 10.1706C23.423 10.8727 23.423 13.1273 21.8341 13.8294L4.05323 21.686C2.6169 22.3207 1.04293 21.1283 1.265 19.5738L1.99102 14.4917C2.06002 14.0087 2.41458 13.6156 2.88791 13.4972L8.87688 12L2.88791 10.5028C2.41458 10.3844 2.06002 9.99129 1.99102 9.50829L1.265 4.42619ZM21.0257 12L3.2449 4.14335L3.89484 8.69294L12.8545 10.9328C13.9654 11.2106 13.9654 12.7894 12.8545 13.0672L3.89484 15.3071L3.2449 19.8566L21.0257 12Z" />
              </svg>
            </ButtonLink>
            <ButtonLink path="https://mail.flashquizz.fr" blank>
              <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512" >
                <g>
                  <g>
                    <path d="M503.847,281.546c4.504,0,8.153-3.649,8.153-8.153V164.688c0-23.676-19.262-42.938-42.938-42.938h-61.418V69.028
			c0-4.504-3.649-8.153-8.153-8.153H8.153C3.649,60.875,0,64.524,0,69.028v247.847c0,4.504,3.649,8.153,8.153,8.153
			c4.504,0,8.153-3.649,8.153-8.153V207.626h375.032v182.309v0.859c0,17.348,7.36,33.009,19.121,44.025H60.331
			c-24.276,0-44.026-19.75-44.026-44.026v-30.437c0-4.504-3.649-8.153-8.153-8.153c-4.504,0-8.153,3.649-8.153,8.153v30.437
			c0,33.267,27.064,60.331,60.331,60.331h391.338c0,0,0.001,0,0.002,0c0.003,0,0.008,0,0.011,0c15.929,0,30.911-6.126,42.287-17.313
			C505.596,422.377,512,407.1,512,390.794v-73.919c0-4.504-3.649-8.153-8.153-8.153s-8.153,3.649-8.153,8.153v73.919
			c0,11.899-4.673,23.048-13.158,31.392c-8.392,8.255-19.469,12.712-31.247,12.624c-1.701-0.014-3.401-0.13-5.088-0.342
			c-21.651-2.765-38.558-21.811-38.558-44.532v-60.56h26.633c4.504,0,8.153-3.649,8.153-8.153V164.688
			c0-14.686,11.947-26.633,26.633-26.633s26.633,11.947,26.633,26.633v108.705C495.694,277.896,499.344,281.546,503.847,281.546z
			 M391.338,191.321H16.306V77.18h375.032V191.321z M426.123,164.688V313.07h-18.48V138.055h27.759
			C429.595,145.38,426.123,154.636,426.123,164.688z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M112.51,95.66c-4.504,0-8.153,3.649-8.153,8.153v38.836L66.521,98.507c-4.824-5.627-14.343-2.088-14.343,5.306v60.875
			c0,4.504,3.649,8.153,8.153,8.153c4.504,0,8.153-3.649,8.153-8.153v-38.836l37.836,44.141c4.829,5.634,14.343,2.081,14.343-5.306
			v-60.875C120.662,99.309,117.013,95.66,112.51,95.66z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M182.081,156.535h-35.329v-18.48h17.936c4.504,0,8.153-3.649,8.153-8.153s-3.649-8.153-8.153-8.153h-17.936v-9.783h35.329
			c4.504,0,8.153-3.649,8.153-8.153s-3.649-8.153-8.153-8.153h-43.482c-4.504,0-8.153,3.649-8.153,8.153v60.875
			c0,4.504,3.649,8.153,8.153,8.153h43.482c4.504,0,8.153-3.649,8.153-8.153C190.234,160.184,186.584,156.535,182.081,156.535z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M279.981,95.974c-4.329-1.242-8.843,1.269-10.078,5.598l-10.842,37.943l-8.536-21.339
			c-1.239-3.096-4.236-5.125-7.57-5.125s-6.331,2.029-7.57,5.125l-8.536,21.339l-10.842-37.943c-1.237-4.33-5.753-6.84-10.078-5.598
			c-4.329,1.237-6.836,5.749-5.598,10.078l17.393,60.875c0.958,3.352,3.941,5.724,7.422,5.903c3.5,0.195,6.691-1.877,7.987-5.115
			l9.823-24.558l9.823,24.558c1.244,3.107,4.249,5.125,7.568,5.125c0.139,0,0.278-0.003,0.419-0.011
			c3.482-0.178,6.465-2.55,7.422-5.903l17.393-60.875C286.818,101.724,284.31,97.212,279.981,95.974z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M347.312,130.446h-35.329v-18.48h35.329c4.504,0,8.153-3.649,8.153-8.153s-3.649-8.153-8.153-8.153H303.83
			c-4.504,0-8.153,3.649-8.153,8.153v34.786c0,4.504,3.649,8.153,8.153,8.153h35.329v9.783H303.83c-4.504,0-8.153,3.649-8.153,8.153
			c0,4.504,3.649,8.153,8.153,8.153h43.482c4.504,0,8.153-3.649,8.153-8.153v-26.089
			C355.465,134.095,351.816,130.446,347.312,130.446z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M164.688,226.106H60.331c-4.504,0-8.153,3.649-8.153,8.153v86.964c0,4.504,3.649,8.153,8.153,8.153h104.357
			c4.504,0,8.153-3.649,8.153-8.153v-86.964C172.841,229.755,169.192,226.106,164.688,226.106z M156.535,313.07H68.484v-70.658
			h88.051V313.07z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M347.312,269.588h-121.75c-4.504,0-8.153,3.649-8.153,8.153c0,4.504,3.649,8.153,8.153,8.153h121.75
			c4.504,0,8.153-3.649,8.153-8.153C355.465,273.237,351.816,269.588,347.312,269.588z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M347.312,226.106h-121.75c-4.504,0-8.153,3.649-8.153,8.153s3.649,8.153,8.153,8.153h121.75
			c4.504,0,8.153-3.649,8.153-8.153S351.816,226.106,347.312,226.106z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M347.312,313.07h-121.75c-4.504,0-8.153,3.649-8.153,8.153s3.649,8.153,8.153,8.153h121.75
			c4.504,0,8.153-3.649,8.153-8.153S351.816,313.07,347.312,313.07z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M347.312,356.552h-121.75c-4.504,0-8.153,3.649-8.153,8.153s3.649,8.153,8.153,8.153h121.75
			c4.504,0,8.153-3.649,8.153-8.153S351.816,356.552,347.312,356.552z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M173.384,356.552H51.635c-4.504,0-8.153,3.649-8.153,8.153s3.649,8.153,8.153,8.153h121.749
			c4.504,0,8.153-3.649,8.153-8.153S177.888,356.552,173.384,356.552z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M173.384,400.034H51.635c-4.504,0-8.153,3.649-8.153,8.153c0,4.504,3.649,8.153,8.153,8.153h121.749
			c4.504,0,8.153-3.649,8.153-8.153C181.537,403.683,177.888,400.034,173.384,400.034z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M347.312,400.034h-121.75c-4.504,0-8.153,3.649-8.153,8.153c0,4.504,3.649,8.153,8.153,8.153h121.75
			c4.504,0,8.153-3.649,8.153-8.153C355.465,403.683,351.816,400.034,347.312,400.034z"/>
                  </g>
                </g>
              </svg>
              NEWS LETTERS
            </ButtonLink>
          </div></div>

        <Image
          width={200}
          height={200}
          alt=''
          src={"/mail.gif"}
        />
      </article>

      
    </main>
  )
}
