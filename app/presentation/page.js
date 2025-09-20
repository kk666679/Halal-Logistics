'use client'

import { useEffect } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'

export default function Presentation() {
  useEffect(() => {
    const deck = new Reveal()
    deck.initialize({
      hash: true,
      slideNumber: true,
    })
  }, [])

  return (
    <div className="reveal">
      <div className="slides">
        {/* Title Slide */}
        <section>
          <h1>Halal Logistics Framework</h1>
          <h2>Strategic Development & Implementation Plan</h2>
          <p>Building Trust Through Shariah-Compliant Supply Chains</p>
        </section>

        {/* Introduction */}
        <section>
          <h2>Introduction</h2>
          <p>Halal logistics ensures that products certified as Halal maintain their status throughout the supply chain, from production to consumption.</p>
          <ul>
            <li>Global Halal market valued at $3.2 trillion (2023)</li>
            <li>CAGR of 5-7% expected through 2030</li>
            <li>Increasing demand for Halal pharmaceuticals and cosmetics</li>
          </ul>
        </section>

        {/* Business Model */}
        <section>
          <h2>Business Model</h2>
          <h3>Type of Entity</h3>
          <ul>
            <li>Logistics service provider</li>
            <li>3PL/4PL provider</li>
            <li>Halal cold storage specialist</li>
            <li>Certification consultancy</li>
          </ul>
          <h3>Target Sectors</h3>
          <ul>
            <li>Food, pharmaceuticals, cosmetics</li>
            <li>Livestock, FMCG</li>
          </ul>
          <h3>Value Proposition</h3>
          <p>"End-to-end Shariah-compliant logistics"</p>
        </section>

        {/* Supply Chain Process */}
        <section>
          <h2>Halal Supply Chain Process</h2>
          <table>
            <thead>
              <tr>
                <th>Process Stage</th>
                <th>Halal Compliance Requirements</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Procurement</td>
                <td>Source only from certified Halal suppliers</td>
              </tr>
              <tr>
                <td>Storage</td>
                <td>Segregated warehousing, no cross-contamination</td>
              </tr>
              <tr>
                <td>Transport</td>
                <td>Dedicated Halal containers or sealed cargo</td>
              </tr>
              <tr>
                <td>Handling</td>
                <td>Trained staff, SOPs to avoid contamination</td>
              </tr>
              <tr>
                <td>Packaging</td>
                <td>Halal-approved materials and labeling</td>
              </tr>
              <tr>
                <td>Distribution</td>
                <td>Integrity of Halal status during entire transit</td>
              </tr>
              <tr>
                <td>Retail/Export</td>
                <td>Halal certification, traceability, consumer trust</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Infrastructure & Technology */}
        <section>
          <h2>Infrastructure & Technology</h2>
          <h3>Halal-Compliant Infrastructure</h3>
          <ul>
            <li>Separate storage zones</li>
            <li>Sealed transport systems</li>
            <li>RFID/barcode tracking</li>
          </ul>
          <h3>Digital Technology</h3>
          <ul>
            <li>Blockchain for traceability</li>
            <li>IoT sensors for cold chain</li>
            <li>ERP system integration with Halal SOPs</li>
          </ul>
          <h3>Certification Platforms</h3>
          <ul>
            <li>Link with regional/national Halal certifiers</li>
          </ul>
        </section>

        {/* Certification & Compliance */}
        <section>
          <h2>Certification & Regulatory Compliance</h2>
          <h3>Collaborate with recognized bodies</h3>
          <ul>
            <li>JAKIM (Malaysia)</li>
            <li>ESMA (UAE)</li>
            <li>OIC/SMIIC</li>
          </ul>
          <h3>Align with standards</h3>
          <ul>
            <li>MS2400:2019 (Halal Logistics)</li>
            <li>SMIIC Standards for Halal Transport/Storage</li>
          </ul>
          <p>Apply for relevant certifications at each node</p>
        </section>

        {/* Strategic Partnerships */}
        <section>
          <h2>Strategic Partnerships</h2>
          <ul>
            <li>Certifying bodies for ongoing compliance</li>
            <li>Halal product manufacturers for consistent demand</li>
            <li>Technology providers (IoT, Blockchain, ERP)</li>
            <li>Government or Halal economic agencies for grants/support</li>
            <li>Training institutions to build Halal logistics competency</li>
          </ul>
        </section>

        {/* Market Entry Strategy */}
        <section>
          <h2>Market Entry Strategy</h2>
          <h3>Pilot Market</h3>
          <p>Choose a region with strong Halal demand and regulatory support (e.g., Malaysia, Indonesia, GCC)</p>
          <h3>Expansion Markets</h3>
          <ul>
            <li>Africa (Nigeria, Kenya)</li>
            <li>Europe (France, UK)</li>
            <li>Central Asia</li>
          </ul>
          <h3>Develop</h3>
          <ul>
            <li>Local partnerships</li>
            <li>Government relations</li>
            <li>Community engagement (build Muslim consumer trust)</li>
          </ul>
        </section>

        {/* Performance KPIs */}
        <section>
          <h2>Performance KPIs</h2>
          <ul>
            <li>% of Halal-certified goods handled</li>
            <li>% of trained Halal-compliant staff</li>
            <li>Contamination incidents (should be zero)</li>
            <li>Time to market</li>
            <li>Certification audit success rate</li>
            <li>Customer satisfaction (Muslim consumers & partners)</li>
          </ul>
        </section>

        {/* Training & SOPs */}
        <section>
          <h2>Training & SOPs</h2>
          <p>Develop Halal-specific SOPs for:</p>
          <ul>
            <li>Vehicle cleaning procedures</li>
            <li>Packaging and labeling</li>
            <li>Contamination control</li>
            <li>Emergency handling</li>
            <li>Staff conduct aligned with Shariah principles</li>
          </ul>
        </section>

        {/* Business Benefits */}
        <section>
          <h2>Business Benefits & Market Opportunities</h2>
          <h3>Business Benefits</h3>
          <ul>
            <li>Access to premium pricing for certified services</li>
            <li>Differentiation in competitive logistics markets</li>
            <li>Reduced risk through enhanced compliance</li>
            <li>Opportunities for international expansion</li>
          </ul>
          <h3>Consumer Trust Enhancement</h3>
          <ul>
            <li>Transparent supply chain visibility</li>
            <li>Assurance of product integrity</li>
            <li>Building brand loyalty among Muslim consumers</li>
            <li>Attracting ethical consumers beyond religious markets</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section>
          <h2>Call to Action</h2>
          <p>Invest in the future of Halal logistics</p>
          <ul>
            <li>Partner with us to build compliant supply chains</li>
            <li>Join the growing Halal economy</li>
            <li>Contact us for detailed business plans and ROI projections</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
