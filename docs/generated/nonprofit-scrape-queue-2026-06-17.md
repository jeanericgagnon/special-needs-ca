# Nonprofit Scrape Queue

Generated: 2026-06-17

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

- trusted nonprofit rows considered: 29499
- distinct normalized scrape targets: 791

This queue is the low-token prep list for nonprofit scraping. It collapses raw source URLs into actual scrape targets, flags network/affiliate patterns, and suggests the right scrape strategy before any promotion work starts.

## Top targets

| Target | Missing Rows | Total Rows | Type | Strategy | Risk | States |
| --- | ---: | ---: | --- | --- | --- | --- |
| parentcenterhub.org | 4691 | 4691 | network_directory | affiliate_discovery | high | alabama, alaska, arizona, arkansas, california, colorado, connecticut, delaware, florida, georgia, hawaii, idaho, illinois, indiana, iowa, kansas, kentucky, louisiana, maine, maryland, massachusetts, michigan, minnesota, mississippi, missouri, montana, nebraska, nevada, new-hampshire, new-jersey, new-mexico, new-york, north-carolina, north-dakota, ohio, oklahoma, oregon, pennsylvania, rhode-island, south-carolina, south-dakota, tennessee, texas, utah, vermont, virginia, washington, west-virginia, wisconsin, wyoming |
| texasautismsociety.org | 509 | 509 | statewide_service_org | domain | medium | texas |
| txp2p.org | 508 | 508 | statewide_service_org | domain | medium | texas |
| thearcoftexas.org | 259 | 259 | statewide_service_org | domain | medium | texas |
| disabilityrightstx.org | 254 | 254 | statewide_service_org | domain | medium | texas |
| navigatelifetexas.org | 254 | 254 | statewide_service_org | domain | medium | texas |
| prntexas.org | 254 | 254 | statewide_service_org | domain | medium | texas |
| thearc.org/chapter/the-arc-of-dallas-fort-worth | 254 | 254 | affiliate_chapter | site_path | medium | texas |
| thearc.org/chapter/the-arc-of-the-gulf-coast | 254 | 254 | affiliate_chapter | site_path | medium | texas |
| thearc.org/chapter/the-arc-of-katy | 254 | 254 | affiliate_chapter | site_path | medium | texas |
| thearc.org/chapter/the-arc-of-greater-beaumont | 254 | 254 | affiliate_chapter | site_path | medium | texas |
| thearc.org/chapter/the-arc-of-san-antonio | 248 | 248 | affiliate_chapter | site_path | medium | texas |
| thearc.org/chapter/the-arc-of-bryan-college-station | 248 | 248 | affiliate_chapter | site_path | medium | texas |
| autismqc.org | 201 | 201 | single_site | domain | medium | illinois, iowa |
| p2pga.org | 159 | 159 | statewide_service_org | domain | medium | georgia |
| thearc.org/chapter/the-arc-southwest-georgia | 158 | 158 | affiliate_chapter | site_path | medium | georgia |
| thearc.org/chapter/the-arc-of-northeast-georgia | 153 | 153 | affiliate_chapter | site_path | medium | georgia |
| arcofky.org | 120 | 120 | statewide_service_org | domain | medium | kentucky |
| asbg.org | 120 | 120 | statewide_service_org | domain | medium | kentucky |
| ask-lou.org | 120 | 120 | statewide_service_org | domain | medium | kentucky |

## First batch to run

- parentcenterhub.org: missing=4691, type=network_directory, strategy=affiliate_discovery, flags=--domain=parentcenterhub.org --org="* The USA has Parent Centers with three jurisdictions in the Pacific Basin (American Samoa, Guam, and the Northern Mariana Islands), two in the Caribbean (Puerto Rico and the U.S. Virgin Islands), and three independent nations in the Pacific Basin/”Freely Associated States” (the Republic of Palau, the Republic of the Marshall Islands (RMI), and the Federated States of Micronesia—comprised of Yap, Pohnpei, Chuuk and Kosrae). The Territories and outlying areas of the Pacific Basin are served by Region D; Puerto Rico and the US Virgin Islands are served by Region A." --org="113 Austin Street, Greeneville, TN 37745" --org="Access For Special Kids Resource Center (ASK) – PTI" --org="Advocates for Children of New York – PTI"
- texasautismsociety.org: missing=509, type=statewide_service_org, strategy=domain, flags=--domain=texasautismsociety.org --org="Autism Society of El Paso" --org="Autism Society of Texas (Statewide Support)" --org="Autism Society Texas" --state=texas
- txp2p.org: missing=508, type=statewide_service_org, strategy=domain, flags=--domain=txp2p.org --org="Texas Family-to-Family Health Information Center" --org="Texas Parent to Parent (Statewide Support)" --state=texas
- thearcoftexas.org: missing=259, type=statewide_service_org, strategy=domain, flags=--domain=thearcoftexas.org --org="The Arc of Northeast Texas" --org="The Arc of Texas (Statewide Support)" --state=texas
- disabilityrightstx.org: missing=254, type=statewide_service_org, strategy=domain, flags=--domain=disabilityrightstx.org --org="Disability Rights Texas (Statewide Support)" --state=texas
- navigatelifetexas.org: missing=254, type=statewide_service_org, strategy=domain, flags=--domain=navigatelifetexas.org --org="Navigate Life Texas (Statewide Support)" --state=texas
- prntexas.org: missing=254, type=statewide_service_org, strategy=domain, flags=--domain=prntexas.org --org="Partners Resource Network (Statewide Support)" --state=texas
- thearc.org/chapter/the-arc-of-dallas-fort-worth: missing=254, type=affiliate_chapter, strategy=site_path, flags=--domain=thearc.org --org="The Arc of DFW Area" --state=texas --seed-url=https://thearc.org/chapter/the-arc-of-dallas-fort-worth
- thearc.org/chapter/the-arc-of-the-gulf-coast: missing=254, type=affiliate_chapter, strategy=site_path, flags=--domain=thearc.org --org="The Arc of the Gulf Coast" --state=texas --seed-url=https://thearc.org/chapter/the-arc-of-the-gulf-coast
- thearc.org/chapter/the-arc-of-katy: missing=254, type=affiliate_chapter, strategy=site_path, flags=--domain=thearc.org --org="The Arc of Katy" --state=texas --seed-url=https://thearc.org/chapter/the-arc-of-katy
- thearc.org/chapter/the-arc-of-greater-beaumont: missing=254, type=affiliate_chapter, strategy=site_path, flags=--domain=thearc.org --org="The Arc of Greater Beaumont" --state=texas --seed-url=https://thearc.org/chapter/the-arc-of-greater-beaumont
- thearc.org/chapter/the-arc-of-san-antonio: missing=248, type=affiliate_chapter, strategy=site_path, flags=--domain=thearc.org --org="The Arc of San Antonio" --state=texas --seed-url=https://thearc.org/chapter/the-arc-of-san-antonio

## Network or affiliate targets needing discovery first

- parentcenterhub.org: missing=4691, states=50, names=93
