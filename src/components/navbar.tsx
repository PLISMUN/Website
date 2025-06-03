import { useState } from "react"
import {
  useColorMode,
  Flex,
  Button,
  IconButton,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  useColorModeValue,
  Heading,
  Img,
  Image,
  Text,
} from "@chakra-ui/react"
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons"
import NextLink from "next/link"
import { useAppSelector } from "@/utils/redux/hooks"

type Page = {
  type: "page"
  title: string
  href: string
}
type Category = {
  type: "category"
  categoryName: string
  pages: Page[]
}

const pages: (Page | Category)[] = [
  {
    type: "page",
    title: "Home",
    href: "/",
  },
  {
    categoryName: "About",
    type: "category",
    pages: [
      { title: "About PLISMUN", href: "/about", type: "page" },
      {
        title: "About the Team",
        href: "/about/team",
        type: "page",
      },
      {
        title: "Privacy Policy",
        href: "/about/privacy",
        type: "page",
      },
      {
        title: "Terms of Service",
        href: "/about/tos",
        type: "page",
      },
      {
        title: "FAQ",
        href: "/about/faq",
        type: "page",
      }
    ],
  },

  {
    categoryName: "Conference",
    type: "category",
    pages: [
      {
        title: "Schedule",
        href: "/conference/schedule",
        type: "page",
      },
      {
        title: "Venues",
        href: "/conference/venues",
        type: "page",
      },
    ],
  },

  {
    type: "page",
    title: "Committees",
    href: "/committees",
  },
  {
    type: "page",
    title: "Partners",
    href: "/partners",
  },
  {
    type: "page",
    title: "Contact",
    href: "/contact",
  },
  {
    // this page exists as a placeholder for user data, which replaces this last element every time the navbar is rendered
    type: "page",
    title: "User",
    href: "/user/signup",
  },
]

const loggedOut: Page = {
  type: "page",
  title: "Log in",
  href: "/user/login",
}
const loggedIn: Category = {
  type: "category",
  categoryName: "User",
  pages: [
    {
      type: "page",
      title: "Apply",
      href: "/user/apply",
    },
    {
      type: "page",
      title: "Log out",
      href: "/user/logout",
    },
  ],
}
const loggedInDelegate: Category = {
  type: "category",
  categoryName: "User",
  pages: [
    {
      type: "page",
      title: "View application",
      href: "/user/apply",
    },
    {
      type: "page",
      title: "Log out",
      href: "/user/logout",
    },
  ],
}
const loggedInAdmin: Category = {
  type: "category",
  categoryName: "User",
  pages: [
    {
      type: "page",
      title: "View applications",
      href: "/admin/applications",
    },
    /* {
      type: "page",
      title: "View database",
      href: "/admin/database",
    }, */
    {
      type: "page",
      title: "Log out",
      href: "/user/logout",
    },
  ],
}

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const userData = useAppSelector((state) => state.user)
  const isDark = colorMode === "dark"
  const [display, changeDisplay] = useState("none")

   if (!userData.user) pages[pages.length - 1] = loggedOut
  else if (userData.user.isStaff) pages[pages.length - 1] = loggedInAdmin
  else if (userData.application) pages[pages.length - 1] = loggedInDelegate
  else pages[pages.length - 1] = loggedIn
 
  return (
    <Flex alignItems="center" width="100%" padding="20px 10px 20px 10px">
      {/* Logo */}
      {/* <a href="/">
        <Image src="/images/miniiconlogo2.png" paddingRight = "10px" height="75px" width="80px"/>
      </a> */}
      <Text whiteSpace="nowrap" paddingLeft="4px" id = "plismun25" userSelect="none" fontSize="3vh" >
        <a href="/"><b>PLISMUN '25</b></a>   {/* add within the first a href = "/" to redirect to home */}
      </Text>
      <a href="/partners/cobis">
        <Image src="/images/cobiscolourv2.png" paddingLeft = "10px" maxWidth = "50%" height = "auto" ></Image>
      </a>

      {/* Desktop */}
      <Flex
        display={["none", "none", "flex", "flex"]}
        marginLeft="auto"
        alignItems="center"
      >
        {pages.map((page, i) =>
          page.type === "category" ? (
            <Menu key={i}>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                my={5}
                variant="ghost"
              >
                {page.categoryName}
              </MenuButton>
              <MenuList>
                {page.pages.map((pg, i) => (
                  <MenuItem key={i}>
                    <NextLink href={pg.href}>
                      <Button
                        as="a"
                        variant="ghost"
                        width="100%"
                        textAlign="right"
                      >
                        {pg.title}
                      </Button>
                    </NextLink>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <NextLink href={page.href} key={i}>
              <Button as="a" variant="ghost" my={5}>
                {page.title}
              </Button>
            </NextLink>
          )
        )}
        <IconButton
          aria-label="Toggle dark mode"
          icon={isDark ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          as="a"
          variant="ghost"
        />
      </Flex>

      {/* Mobile closed */}
      <Flex
        display={["flex", "flex", "none", "none"]}
        marginLeft="auto"
        alignItems="center"
      >
        <IconButton
          aria-label="Open Menu"
          size="lg"
          icon={<HamburgerIcon />}
          onClick={() => changeDisplay("flex")}
          as="a"
          variant="ghost"
        />
        <IconButton
          aria-label="Toggle dark mode"
          size="lg"
          icon={isDark ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          as="a"
          variant="ghost"
        />
      </Flex>
      {/* Mobile open */}
      <Flex
        w="100vw"
        display={display}
        padding="20px 10px 20px 10px"
        bgColor={useColorModeValue("white", "gray.100")}
        h="100vh"
        pos="fixed"
        top="0"
        left="0"
        zIndex={20}
        overflowY="auto"
        flexDir="column"
      >
        <Flex justify="flex-end">
          <IconButton
            mt={2}
            mr={2}
            aria-label="Open Menu"
            size="lg"
            icon={<CloseIcon />}
            onClick={() => changeDisplay("none")}
            variant="ghost"
          />
        </Flex>

        <Flex flexDir="column" align="center">
          {pages.map((page, i) =>
            page.type === "category" ? (
              <Menu key={i}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  my={5}
                  variant="ghost"
                >
                  {page.categoryName}
                </MenuButton>
                <MenuList>
                  {page.pages.map((pg, i) => (
                    <MenuItem key={i}>
                      <NextLink href={pg.href}>
                        <Button
                          as="a"
                          variant="ghost"
                          aria-label={pg.title}
                          w="100%"
                          onClick={() => changeDisplay("none")}
                        >
                          {pg.title}
                        </Button>
                      </NextLink>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <NextLink href={page.href} key={i}>
                <Button
                  as="a"
                  variant="ghost"
                  my={5}
                  onClick={() => changeDisplay("none")}
                >
                  {page.title}
                </Button>
              </NextLink>
            )
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Navbar
